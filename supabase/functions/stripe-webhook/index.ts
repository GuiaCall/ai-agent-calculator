
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
      return errorResponse('Missing Stripe secret key', null, 500);
    }
    
    if (!endpointSecret) {
      return errorResponse('Missing Stripe webhook secret', null, 500);
    }
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return errorResponse('Missing Supabase credentials', null, 500);
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
      return errorResponse('Missing Stripe signature', null, 401);
    }
    
    let event;
    try {
      // We use constructEventAsync with Deno
      event = await stripe.webhooks.constructEventAsync(body, signature, endpointSecret);
      console.log("Event constructed successfully:", event.type);
      console.log("Event data:", JSON.stringify(event.data.object, null, 2));
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return errorResponse(`Webhook signature verification failed: ${err.message}`, err, 401);
    }

    console.log("Handling event:", event.type);
    
    // Handle different event types
    switch (event.type) {
      // When a subscription is created or updated
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        console.log("Processing subscription event:", subscription.id);
        console.log("Subscription status:", subscription.status);
        
        // Get the customer information
        const customer = await stripe.customers.retrieve(subscription.customer);
        const customerEmail = customer.email;
        console.log("Customer email:", customerEmail);

        if (!customerEmail) {
          console.error("No email found for customer");
          return errorResponse('Customer email not found', null, 400);
        }

        // Find the user by email
        const { data: userData, error: userError } = await supabaseClient.auth.admin.getUserByEmail(customerEmail);
        console.log("User data from email lookup:", userData);
        console.log("User error from email lookup:", userError);

        if (userError || !userData?.user) {
          console.error('Error finding user:', userError || "User not found");
          return errorResponse('Error finding user', userError, 404);
        }

        const userId = userData.user.id;
        console.log("Found user ID:", userId);
        
        // Determine plan type based on status
        const planType = subscription.status === 'active' ? 'pro' : 'free';
        const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();

        console.log(`Updating subscription for user ${userId} to plan: ${planType}, status: ${subscription.status}`);
        
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
          console.log("Updating existing subscription for user:", userId);
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
          console.log("Update result:", updateError ? "Error" : "Success");
        } else {
          // Insert new subscription
          console.log("Creating new subscription for user:", userId);
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
          console.log("Insert result:", updateError ? "Error" : "Success");
        }

        if (updateError) {
          console.error('Error updating subscription:', updateError);
          return errorResponse('Error updating subscription', updateError, 500);
        }

        console.log("Subscription successfully updated/created in database");
        break;
      }

      // Handle canceled subscriptions
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        console.log("Processing subscription deletion:", subscription.id);
        
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
          return errorResponse('Error updating subscription', subscriptionError, 500);
        }

        console.log("Subscription successfully marked as canceled");
        break;
      }

      // Handle completed payment
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log("Processing completed checkout session:", session.id);
        console.log("Session details:", JSON.stringify(session, null, 2));
        
        // If this is a subscription checkout
        if (session.mode === 'subscription') {
          // Get the subscription ID
          const subscriptionId = session.subscription;
          const customerId = session.customer;
          
          if (!subscriptionId) {
            console.error("No subscription ID in session");
            return errorResponse('No subscription ID in session', null, 400);
          }
          
          console.log(`Found subscription ID: ${subscriptionId} and customer ID: ${customerId}`);
          
          // Get customer details to find user
          const customer = await stripe.customers.retrieve(customerId);
          const customerEmail = customer.email;
          
          if (!customerEmail) {
            console.error("No email found for customer");
            return errorResponse('Customer email not found', null, 400);
          }
          
          console.log("Customer email:", customerEmail);
          
          // Find the user by email
          const { data: userData, error: userError } = await supabaseClient.auth.admin.getUserByEmail(customerEmail);

          if (userError || !userData?.user) {
            console.error('Error finding user:', userError || "User not found");
            return errorResponse('Error finding user', userError, 404);
          }

          const userId = userData.user.id;
          console.log("Found user ID for checkout completion:", userId);
          
          // Get subscription details
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();
          
          console.log(`Updating subscription for user ${userId} to pro plan, status: active`);
          
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
            console.log("Updating existing subscription after checkout completion");
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
            console.log("Update result:", updateError ? "Error" : "Success");
          } else {
            // Insert new subscription
            console.log("Creating new subscription after checkout completion");
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
            console.log("Insert result:", updateError ? "Error" : "Success");
          }

          if (updateError) {
            console.error('Error updating subscription after checkout:', updateError);
            return errorResponse('Error updating subscription', updateError, 500);
          }

          console.log("Subscription successfully updated to pro plan after checkout");
        }
        
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Webhook error:', error.message, error.stack);
    return errorResponse(error.message, error, 500);
  }
});
