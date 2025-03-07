
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
    let requestData = {};
    try {
      console.log("Parsing request body");
      if (req.body) {
        const body = await req.json();
        console.log("Request body:", JSON.stringify(body));
        requestData = body || {};
      } else {
        console.log("No request body provided");
      }
    } catch (e) {
      console.error("Failed to parse request body:", e);
      // Continue with empty requestData rather than failing
      console.log("Continuing with empty request data");
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
    
    try {
      console.log("Validating user token");
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

      console.log("Initializing Stripe with key:", stripeSecretKey.substring(0, 8) + "...");
      const stripe = new Stripe(stripeSecretKey, {
        apiVersion: '2023-10-16',
        httpClient: Stripe.createFetchHttpClient(),
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
        
        try {
          const subscriptions = await stripe.subscriptions.list({
            customer: customer_id,
            status: 'active',
            limit: 1
          });

          if (subscriptions.data.length > 0) {
            console.log("Customer has an existing subscription, will proceed to update it");
            
            // Cancel existing subscription first
            try {
              await stripe.subscriptions.cancel(subscriptions.data[0].id);
              console.log("Cancelled existing subscription:", subscriptions.data[0].id);
            } catch (cancelErr) {
              console.error("Failed to cancel existing subscription:", cancelErr);
              // Continue anyway, as we'll try to create a new checkout session
            }
          }
        } catch (subErr) {
          console.error("Error checking subscriptions:", subErr);
          // Continue even if subscription check fails
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
            JSON.stringify({ error: "Failed to create customer in Stripe", details: err.message }),
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
      
      // Use the exact price ID
      const priceId = 'price_1QZBgMJxQ3vRyrS2UvIcF8Oe';
      console.log("Using price ID:", priceId);
      
      const sessionParams = {
        customer: customer_id,
        line_items: [
          {
            price: priceId,
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
      const couponCode = requestData && typeof requestData === 'object' && 'couponCode' in requestData
        ? requestData.couponCode
        : undefined;
        
      if (couponCode && typeof couponCode === 'string' && couponCode.trim()) {
        console.log("Checking coupon code:", couponCode);
        try {
          // Validate if coupon exists and is valid
          const coupon = await stripe.coupons.retrieve(couponCode.trim());
          if (coupon.valid) {
            console.log("Valid coupon code:", couponCode);
            // @ts-ignore - Stripe types may not properly include discounts
            sessionParams.discounts = [{ coupon: couponCode.trim() }];
          }
        } catch (couponError) {
          console.log('Invalid coupon code:', couponError);
          // We'll proceed without the coupon if it's invalid
        }
      }

      // Create the checkout session
      try {
        console.log("Creating checkout session with params:", JSON.stringify(sessionParams, null, 2));
        const session = await stripe.checkout.sessions.create(sessionParams);
        console.log("Checkout session created:", session.id);
        console.log("Session URL:", session.url);
        
        if (!session.url) {
          throw new Error("Checkout session URL is missing");
        }
        
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
          JSON.stringify({ 
            error: stripeError.message || "Failed to create checkout session",
            details: stripeError
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          }
        );
      }
    } catch (authError) {
      console.error("Error validating token:", authError);
      return new Response(
        JSON.stringify({ error: "Authentication error", details: authError }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred", details: error }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
