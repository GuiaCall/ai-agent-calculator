
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Error response helper
const errorResponse = (message: string, details: any = null, status = 400) => {
  console.error(`Error: ${message}`, details);
  return new Response(
    JSON.stringify({ 
      error: message, 
      details: details 
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status,
    }
  );
};

// Initialize Supabase client
const initSupabaseClient = () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase configuration");
  }

  return createClient(supabaseUrl, supabaseAnonKey);
};

// Initialize Stripe client
const initStripeClient = () => {
  const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
  
  if (!stripeSecretKey) {
    throw new Error("Stripe secret key not found in environment");
  }

  return new Stripe(stripeSecretKey, {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
  });
};

// Parse and validate request data
const parseRequestData = async (req: Request) => {
  try {
    if (req.body) {
      const body = await req.json();
      console.log("Request body:", JSON.stringify(body));
      return body || {};
    }
    console.log("No request body provided");
    return {};
  } catch (e) {
    console.error("Failed to parse request body:", e);
    return {};
  }
};

// Validate user from auth token
const validateUser = async (req: Request, supabaseClient: any) => {
  // Log all request headers for debugging
  console.log("All request headers:", JSON.stringify(Object.fromEntries([...req.headers.entries()])));
  
  // Check for Authorization header
  const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
  
  if (!authHeader) {
    console.error("No Authorization header found in the request");
    throw new Error("Authorization header is required");
  }

  console.log("Authorization header:", authHeader);
  const token = authHeader.replace('Bearer ', '');
  
  if (!token || token.trim() === '') {
    console.error("Empty token provided");
    throw new Error("Valid authentication token is required");
  }
  
  try {
    console.log("Validating token...");
    const { data, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !data?.user) {
      console.error("Auth error:", userError);
      throw new Error("Authentication failed: " + (userError?.message || "User not found"));
    }

    const user = data.user;
    console.log("User validated successfully:", user.id);
    
    if (!user.email) {
      throw new Error("No email found for authenticated user");
    }

    return user;
  } catch (error) {
    console.error("Token validation error:", error);
    throw new Error(`Authentication failed: ${error.message}`);
  }
};

// Get or create Stripe customer
const getOrCreateCustomer = async (stripe: Stripe, email: string, userId: string) => {
  console.log("Checking for existing customer with email:", email);
  const customers = await stripe.customers.list({
    email: email,
    limit: 1
  });

  if (customers.data.length > 0) {
    console.log("Found existing customer:", customers.data[0].id);
    return customers.data[0].id;
  }

  // Create a new customer if one doesn't exist
  console.log("Creating new customer");
  const newCustomer = await stripe.customers.create({
    email: email,
    metadata: {
      user_id: userId
    }
  });
  console.log("Created new customer:", newCustomer.id);
  return newCustomer.id;
};

// Handle existing subscriptions
const handleExistingSubscriptions = async (stripe: Stripe, customerId: string) => {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
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
};

// Validate coupon code
const validateCouponCode = async (stripe: Stripe, couponCode: string | undefined) => {
  if (!couponCode || typeof couponCode !== 'string' || !couponCode.trim()) {
    return null;
  }

  console.log("Checking coupon code:", couponCode);
  try {
    const coupon = await stripe.coupons.retrieve(couponCode.trim());
    if (coupon.valid) {
      console.log("Valid coupon code:", couponCode);
      return couponCode.trim();
    }
  } catch (couponError) {
    console.log('Invalid coupon code:', couponError);
  }
  return null;
};

// Create checkout session
const createCheckoutSession = async (
  stripe: Stripe, 
  customerId: string, 
  origin: string,
  userId: string,
  validCouponCode: string | null
) => {
  // Updated price ID as specified by the user
  const priceId = 'price_1QZBgMJxQ3vRyrS2UvIcF8Oe';
  console.log("Using price ID:", priceId);
  
  const sessionParams: any = {
    customer: customerId,
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
      user_id: userId
    }
  };

  // Add valid coupon code if provided
  if (validCouponCode) {
    sessionParams.discounts = [{ coupon: validCouponCode }];
  }

  console.log("Creating checkout session with params:", JSON.stringify(sessionParams, null, 2));
  const session = await stripe.checkout.sessions.create(sessionParams);
  console.log("Checkout session created:", session.id);
  
  if (!session.url) {
    throw new Error("Checkout session URL is missing");
  }
  
  return session.url;
};

// Main request handler
const handleRequest = async (req: Request) => {
  try {
    console.log("Starting checkout session creation");
    console.log("Request method:", req.method);
    console.log("Request URL:", req.url);
    
    // Initialize Supabase client
    const supabaseClient = initSupabaseClient();
    
    // Parse request data
    const requestData = await parseRequestData(req);
    
    // Validate user from auth token
    const user = await validateUser(req, supabaseClient);
    
    // Initialize Stripe
    const stripe = initStripeClient();
    
    // Get or create customer
    const customerId = await getOrCreateCustomer(stripe, user.email, user.id);
    
    // Handle existing subscriptions
    await handleExistingSubscriptions(stripe, customerId);
    
    // Build the checkout session parameters
    const origin = req.headers.get('origin') || 'http://localhost:5173';
    console.log("Using origin:", origin);
    
    // Check coupon code
    const couponCode = requestData && typeof requestData === 'object' && 'couponCode' in requestData
      ? requestData.couponCode
      : undefined;
      
    const validCouponCode = await validateCouponCode(stripe, couponCode);
    
    // Create the checkout session
    try {
      const sessionUrl = await createCheckoutSession(stripe, customerId, origin, user.id, validCouponCode);
      
      return new Response(
        JSON.stringify({ url: sessionUrl }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } catch (stripeError) {
      return errorResponse(
        stripeError.message || "Failed to create checkout session",
        stripeError,
        500
      );
    }
  } catch (error) {
    return errorResponse(
      error.message || "An unexpected error occurred",
      error,
      error.message?.includes("Authentication") ? 401 : 500
    );
  }
};

// Main serve function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS request");
    return new Response(null, { headers: corsHeaders });
  }

  return handleRequest(req);
});
