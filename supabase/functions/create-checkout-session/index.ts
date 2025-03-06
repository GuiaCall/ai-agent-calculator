
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
    console.log("Handling OPTIONS request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting checkout session creation");
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase configuration");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

    // Parse request body
    let requestData;
    try {
      console.log("Parsing request body");
      const { couponCode, ...restData } = await req.json();
      requestData = { couponCode, ...restData };
      console.log("Request data:", JSON.stringify(requestData));
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
      console.error("Missing Authorization header");
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
    
    if (userError || !data?.user) {
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
      console.error("No email found for user");
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

    console.log("Initializing Stripe");
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    // Check for existing customer
    console.log("Checking for existing customer with email:", email);
    const customers = await stripe.customers.list({
      email: email,
      limit: 1
    });

    let customer_id;
    if (customers.data.length > 0) {
      console.log("Found existing customer:", customers.data[0].id);
      customer_id = customers.data[0].id;
      
      const subscriptions = await stripe.subscriptions.list({
        customer: customers.data[0].id,
        status: 'active',
        price: 'price_1QZBgMJxQ3vRyrS2UvIcF8Oe',
        limit: 1
      });

      if (subscriptions.data.length > 0) {
        console.log("Customer already has an active subscription");
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
      console.log("Creating new customer");
      try {
        const newCustomer = await stripe.customers.create({
          email: email,
          metadata: {
            user_id: user.id
          }
        });
        customer_id = newCustomer.id;
        console.log("Created new customer:", customer_id);
      } catch (err) {
        console.error("Failed to create customer:", err);
        return new Response(
          JSON.stringify({ error: "Failed to create customer in Stripe" }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          }
        );
      }
    }

    // Build the checkout session parameters
    const origin = req.headers.get('origin') || 'http://localhost:5173';
    console.log("Using origin:", origin);
    
    const sessionParams = {
      customer: customer_id,
      line_items: [
        {
          price: 'price_1QZBgMJxQ3vRyrS2UvIcF8Oe',
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/dashboard?checkout_success=true`,
      cancel_url: `${origin}/pricing`,
      allow_promotion_codes: true,
      metadata: {
        user_id: user.id
      }
    };

    // Add coupon code if provided
    if (requestData.couponCode) {
      console.log("Checking coupon code:", requestData.couponCode);
      try {
        // Validate if coupon exists and is valid
        const coupon = await stripe.coupons.retrieve(requestData.couponCode);
        if (coupon.valid) {
          console.log("Valid coupon code:", requestData.couponCode);
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
      console.log("Creating checkout session with params:", JSON.stringify(sessionParams));
      const session = await stripe.checkout.sessions.create(sessionParams);
      console.log("Checkout session created:", session.id);
      console.log("Session URL:", session.url);
      
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
