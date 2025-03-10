
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Enhanced error response helper with better logging
const errorResponse = (message: string, details: any = null, status = 400) => {
  console.error(`Error: ${message}`, details);
  return new Response(
    JSON.stringify({ error: message, details: details }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status,
    }
  );
};

// Success response helper
const successResponse = (data: any = { received: true }) => {
  return new Response(
    JSON.stringify(data),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    }
  );
};

// Handle CORS preflight requests
serve(async (req) => {
  console.log("Stripe webhook received");
  
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body and signature
    const body = await req.text();
    const signature = req.headers.get('Stripe-Signature');
    
    console.log("Processing webhook with signature:", signature ? "Present" : "Missing");
    
    // Initialize environment variables
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    // Validate required environment variables
    if (!stripeSecretKey) {
      console.error('Missing Stripe secret key');
      return successResponse({ error: 'Configuration error', received: true });
    }
    
    if (!endpointSecret) {
      console.error('Missing Stripe webhook secret');
      return successResponse({ error: 'Configuration error', received: true });
    }
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase credentials');
      return successResponse({ error: 'Configuration error', received: true });
    }
    
    // Initialize Stripe
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });
    
    // Initialize Supabase client with service role for admin operations
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the webhook signature - THIS IS CRITICAL
    if (!signature) {
      console.error('Missing Stripe signature');
      // Still return 200 to prevent retries for malformed requests
      return successResponse({ error: 'Missing signature', received: true });
    }
    
    let event;
    try {
      // We use constructEventAsync with Deno
      event = await stripe.webhooks.constructEventAsync(body, signature, endpointSecret);
      console.log("Event constructed successfully:", event.type);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      // Return success even for invalid signatures to prevent retries
      return successResponse({ error: 'Invalid signature', received: true });
    }

    console.log("Handling event:", event.type);
    
    // Handle different event types
    try {
      switch (event.type) {
        // When a subscription is created or updated
        case 'customer.subscription.created':
        case 'customer.subscription.updated': {
          const subscription = event.data.object;
          console.log("Processing subscription event:", subscription.id);
          
          // Get the customer information
          const customer = await stripe.customers.retrieve(subscription.customer);
          const customerEmail = customer.email;
          
          if (!customerEmail) {
            console.error("No email found for customer");
            return successResponse({ warning: 'Customer email not found', received: true });
          }

          // Find the user by email
          const { data: userData, error: userError } = await supabaseClient.auth.admin.getUserByEmail(customerEmail);

          if (userError || !userData?.user) {
            console.error('Error finding user:', userError || "User not found");
            return successResponse({ warning: 'User not found', received: true });
          }

          const userId = userData.user.id;
          
          // Determine plan type based on status
          const planType = subscription.status === 'active' ? 'pro' : 'free';
          const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();
          
          // Check if the subscription already exists
          const { data: existingSubscription, error: checkError } = await supabaseClient
            .from('subscriptions')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();
            
          if (checkError) {
            console.error('Error checking existing subscription:', checkError);
          }
          
          let updateError;
          
          if (existingSubscription) {
            // Update existing subscription
            const { error } = await supabaseClient
              .from('subscriptions')
              .update({
                stripe_customer_id: subscription.customer,
                stripe_subscription_id: subscription.id,
                plan_type: planType,
                status: subscription.status,
                current_period_end: currentPeriodEnd,
                updated_at: new Date().toISOString()
              })
              .eq('user_id', userId);
              
            updateError = error;
          } else {
            // Insert new subscription
            const { error } = await supabaseClient
              .from('subscriptions')
              .insert({
                user_id: userId,
                stripe_customer_id: subscription.customer,
                stripe_subscription_id: subscription.id,
                plan_type: planType,
                status: subscription.status,
                current_period_end: currentPeriodEnd
              });
              
            updateError = error;
          }

          if (updateError) {
            console.error('Error updating subscription:', updateError);
            // Still return success to prevent retries
            return successResponse({ warning: 'Database update failed', received: true });
          }

          break;
        }

        // Handle canceled subscriptions
        case 'customer.subscription.deleted': {
          const subscription = event.data.object;
          
          // Update the subscription status to inactive
          const { error: subscriptionError } = await supabaseClient
            .from('subscriptions')
            .update({ 
              status: 'canceled',
              plan_type: 'free',
              updated_at: new Date().toISOString()
            })
            .eq('stripe_subscription_id', subscription.id);

          if (subscriptionError) {
            console.error('Error updating subscription:', subscriptionError);
            // Still return success to prevent retries
            return successResponse({ warning: 'Database update failed', received: true });
          }

          break;
        }

        // Handle completed payment
        case 'checkout.session.completed': {
          const session = event.data.object;
          
          // If this is a subscription checkout
          if (session.mode === 'subscription') {
            // Get the subscription ID
            const subscriptionId = session.subscription;
            const customerId = session.customer;
            
            if (!subscriptionId) {
              console.error("No subscription ID in session");
              return successResponse({ warning: 'Missing subscription ID', received: true });
            }
            
            // Get customer details to find user
            const customer = await stripe.customers.retrieve(customerId);
            const customerEmail = customer.email;
            
            if (!customerEmail) {
              console.error("No email found for customer");
              return successResponse({ warning: 'Customer email not found', received: true });
            }
            
            // Find the user by email
            const { data: userData, error: userError } = await supabaseClient.auth.admin.getUserByEmail(customerEmail);

            if (userError || !userData?.user) {
              console.error('Error finding user:', userError || "User not found");
              return successResponse({ warning: 'User not found', received: true });
            }

            const userId = userData.user.id;
            
            // Get subscription details
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();
            
            // Check if the subscription already exists
            const { data: existingSubscription, error: checkError } = await supabaseClient
              .from('subscriptions')
              .select('*')
              .eq('user_id', userId)
              .maybeSingle();
              
            if (checkError) {
              console.error('Error checking existing subscription:', checkError);
            }
            
            let updateError;
            
            if (existingSubscription) {
              // Update existing subscription
              const { error } = await supabaseClient
                .from('subscriptions')
                .update({
                  stripe_customer_id: customerId,
                  stripe_subscription_id: subscriptionId,
                  plan_type: 'pro',
                  status: 'active',
                  current_period_end: currentPeriodEnd,
                  updated_at: new Date().toISOString()
                })
                .eq('user_id', userId);
                
              updateError = error;
            } else {
              // Insert new subscription
              const { error } = await supabaseClient
                .from('subscriptions')
                .insert({
                  user_id: userId,
                  stripe_customer_id: customerId,
                  stripe_subscription_id: subscriptionId,
                  plan_type: 'pro',
                  status: 'active',
                  current_period_end: currentPeriodEnd
                });
                
              updateError = error;
            }

            if (updateError) {
              console.error('Error updating subscription after checkout:', updateError);
              // Still return success to prevent retries
              return successResponse({ warning: 'Database update failed', received: true });
            }
          }
          
          break;
        }

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (processingError) {
      console.error('Error processing webhook:', processingError);
      // Return success even for processing errors to prevent retries
      return successResponse({ warning: 'Processing error', received: true });
    }

    return successResponse();
  } catch (error) {
    console.error('Webhook error:', error.message, error.stack);
    // Return success even for general errors to prevent retries
    return successResponse({ error: 'Internal error', received: true });
  }
});
