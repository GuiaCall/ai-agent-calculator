
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Parse request body
    let requestData;
    try {
      const { couponCode, ...restData } = await req.json();
      requestData = { couponCode, ...restData };
    } catch (e) {
      console.error("Failed to parse request body:", e);
      return new Response(
        JSON.stringify({ error: "Invalid request body" }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Get auth token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization header is required" }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !data.user) {
      console.error("Auth error:", userError);
      return new Response(
        JSON.stringify({ error: "Authentication failed" }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      );
    }

    const user = data.user;
    const email = user.email;

    if (!email) {
      return new Response(
        JSON.stringify({ error: "No email found for authenticated user" }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Initialize Stripe
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      console.error("Stripe secret key not found in environment");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    // Check for existing customer
    const customers = await stripe.customers.list({
      email: email,
      limit: 1
    });

    let customer_id = undefined;
    if (customers.data.length > 0) {
      customer_id = customers.data[0].id;
      const subscriptions = await stripe.subscriptions.list({
        customer: customers.data[0].id,
        status: 'active',
        price: 'price_1QZBgMJxQ3vRyrS2UvIcF8Oe',
        limit: 1
      });

      if (subscriptions.data.length > 0) {
        return new Response(
          JSON.stringify({ error: "Customer already has an active subscription" }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
      }
    } else {
      // Create a new customer if one doesn't exist
      const newCustomer = await stripe.customers.create({
        email: email,
        metadata: {
          user_id: user.id
        }
      });
      customer_id = newCustomer.id;
    }

    // Build the checkout session parameters
    const sessionParams = {
      customer: customer_id,
      customer_email: customer_id ? undefined : email,
      line_items: [
        {
          price: 'price_1QZBgMJxQ3vRyrS2UvIcF8Oe',
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.get('origin') || 'http://localhost:5173'}/dashboard?checkout_success=true`,
      cancel_url: `${req.headers.get('origin') || 'http://localhost:5173'}/pricing`,
      allow_promotion_codes: true,
      metadata: {
        user_id: user.id
      }
    };

    // Add coupon code if provided
    if (requestData.couponCode) {
      try {
        // Validate if coupon exists and is valid
        const coupon = await stripe.coupons.retrieve(requestData.couponCode);
        if (coupon.valid) {
          // @ts-ignore - Stripe types may not properly include discounts
          sessionParams.discounts = [{ coupon: requestData.couponCode }];
        }
      } catch (couponError) {
        console.log('Invalid coupon code:', couponError);
        // We'll proceed without the coupon if it's invalid
      }
    }

    // Create the checkout session
    try {
      const session = await stripe.checkout.sessions.create(sessionParams);
      
      return new Response(
        JSON.stringify({ url: session.url }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } catch (stripeError) {
      console.error("Stripe session creation error:", stripeError);
      return new Response(
        JSON.stringify({ error: stripeError.message || "Failed to create checkout session" }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred" }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
