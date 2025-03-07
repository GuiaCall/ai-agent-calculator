
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle CORS preflight requests
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body
    const body = await req.text();
    const signature = req.headers.get('Stripe-Signature');

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Verify the webhook signature
    let event;
    const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    if (!signature || !endpointSecret) {
      return new Response(
        JSON.stringify({ error: 'Missing signature or webhook secret' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(
        JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    console.log(`Processing webhook event: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      // When a subscription is created or updated
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        console.log(`Processing subscription event for subscription ID: ${subscription.id}, status: ${subscription.status}`);
        
        // Get the customer information
        const customer = await stripe.customers.retrieve(subscription.customer);
        const customerEmail = customer.email;
        console.log(`Customer email for subscription: ${customerEmail}`);

        // Find the user by email
        const { data: userData, error: userError } = await supabaseClient.auth.admin.getUserByEmail(customerEmail);

        if (userError || !userData) {
          console.error('Error finding user:', userError || 'No user found with email ' + customerEmail);
          return new Response(
            JSON.stringify({ error: 'Error finding user' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }

        const userId = userData.user.id;
        const planType = subscription.status === 'active' ? 'pro' : 'free';
        const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();

        console.log(`Updating subscription for user ${userId} to plan type: ${planType}`);

        // Update or create the subscription record
        const { error: subscriptionError } = await supabaseClient
          .from('subscriptions')
          .upsert({
            user_id: userId,
            stripe_customer_id: subscription.customer,
            stripe_subscription_id: subscription.id,
            plan_type: planType,
            status: subscription.status,
            current_period_end: currentPeriodEnd
          }, { onConflict: 'user_id' });

        if (subscriptionError) {
          console.error('Error updating subscription:', subscriptionError);
          return new Response(
            JSON.stringify({ error: 'Error updating subscription' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }

        console.log(`Successfully updated subscription for user ${userId}`);
        break;
      }

      // Handle canceled subscriptions
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        console.log(`Processing subscription deletion for subscription ID: ${subscription.id}`);
        
        // Update the subscription status to inactive
        const { error: subscriptionError } = await supabaseClient
          .from('subscriptions')
          .update({ 
            status: 'canceled',
            plan_type: 'free'
          })
          .eq('stripe_subscription_id', subscription.id);

        if (subscriptionError) {
          console.error('Error updating subscription:', subscriptionError);
          return new Response(
            JSON.stringify({ error: 'Error updating subscription' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }

        console.log(`Successfully marked subscription ${subscription.id} as canceled`);
        break;
      }

      // Handle completed payment
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log(`Processing checkout session completed: ${session.id}`);
        
        // If this is a subscription checkout
        if (session.mode === 'subscription') {
          // Get the subscription ID
          const subscriptionId = session.subscription;
          const customerId = session.customer;
          
          console.log(`Checkout completed for subscription: ${subscriptionId}, customer: ${customerId}`);
          
          // Get customer details to find user
          const customer = await stripe.customers.retrieve(customerId);
          const customerEmail = customer.email;
          console.log(`Customer email from checkout: ${customerEmail}`);
          
          // Find the user by email
          const { data: userData, error: userError } = await supabaseClient.auth.admin.getUserByEmail(customerEmail);

          if (userError || !userData) {
            console.error('Error finding user:', userError || 'No user found with email ' + customerEmail);
            return new Response(
              JSON.stringify({ error: 'Error finding user' }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
            );
          }

          const userId = userData.user.id;
          
          // Get subscription details
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();
          
          console.log(`Updating subscription from checkout for user ${userId}, status: ${subscription.status}`);
          
          // Update the subscription in the database
          const { error: subscriptionError } = await supabaseClient
            .from('subscriptions')
            .upsert({
              user_id: userId,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              plan_type: 'pro',
              status: 'active',
              current_period_end: currentPeriodEnd
            }, { onConflict: 'user_id' });

          if (subscriptionError) {
            console.error('Error updating subscription:', subscriptionError);
            return new Response(
              JSON.stringify({ error: 'Error updating subscription' }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
            );
          }
          
          console.log(`Successfully updated subscription from checkout for user ${userId}`);
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
