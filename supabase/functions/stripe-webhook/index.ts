
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle CORS preflight requests
serve(async (req) => {
  console.log("Stripe webhook received");
  
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body
    const body = await req.text();
    const signature = req.headers.get('Stripe-Signature');
    
    console.log("Processing webhook with signature:", signature ? "Present" : "Missing");

    // Initialize Stripe
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      console.error("Missing Stripe secret key");
      return new Response(
        JSON.stringify({ error: 'Missing Stripe secret key' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    // Verify the webhook signature
    let event;
    const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    if (!signature || !endpointSecret) {
      console.error("Missing signature or webhook secret");
      return new Response(
        JSON.stringify({ error: 'Missing signature or webhook secret' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
      console.log("Event constructed successfully:", event.type);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(
        JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase credentials");
      return new Response(
        JSON.stringify({ error: 'Missing Supabase credentials' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Handling event:", event.type);
    
    // Handle different event types
    switch (event.type) {
      // When a subscription is created or updated
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        console.log("Processing subscription event:", subscription.id);
        console.log("Subscription status:", subscription.status);
        console.log("Subscription object:", JSON.stringify(subscription, null, 2));
        
        // Get the customer information
        const customer = await stripe.customers.retrieve(subscription.customer);
        const customerEmail = customer.email;
        console.log("Customer email:", customerEmail);

        if (!customerEmail) {
          console.error("No email found for customer");
          return new Response(
            JSON.stringify({ error: 'Customer email not found' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        // Find the user by email
        const { data: userData, error: userError } = await supabaseClient.auth.admin.getUserByEmail(customerEmail);

        if (userError || !userData?.user) {
          console.error('Error finding user:', userError || "User not found");
          return new Response(
            JSON.stringify({ error: 'Error finding user' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
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
          return new Response(
            JSON.stringify({ error: 'Error updating subscription' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }

        console.log("Subscription successfully updated");
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
          return new Response(
            JSON.stringify({ error: 'Error updating subscription' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
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
            return new Response(
              JSON.stringify({ error: 'No subscription ID in session' }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            );
          }
          
          console.log(`Found subscription ID: ${subscriptionId} and customer ID: ${customerId}`);
          
          // Get customer details to find user
          const customer = await stripe.customers.retrieve(customerId);
          const customerEmail = customer.email;
          
          if (!customerEmail) {
            console.error("No email found for customer");
            return new Response(
              JSON.stringify({ error: 'Customer email not found' }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            );
          }
          
          console.log("Customer email:", customerEmail);
          
          // Find the user by email
          const { data: userData, error: userError } = await supabaseClient.auth.admin.getUserByEmail(customerEmail);

          if (userError || !userData?.user) {
            console.error('Error finding user:', userError || "User not found");
            return new Response(
              JSON.stringify({ error: 'Error finding user' }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
            );
          }

          const userId = userData.user.id;
          console.log("Found user ID:", userId);
          
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
            console.error('Error updating subscription:', updateError);
            return new Response(
              JSON.stringify({ error: 'Error updating subscription' }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
            );
          }

          console.log("Subscription successfully updated to pro plan");
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
    console.error('Webhook error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
