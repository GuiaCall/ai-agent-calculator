
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders, createErrorResponse, createSuccessResponse, parseRequestBody } from './utils.ts';
import { validateUserToken } from './auth-service.ts';
import { initializeStripe, getOrCreateCustomer, createCheckoutSession } from './stripe-service.ts';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting checkout session creation");
    
    // Parse the request body
    const requestData = await parseRequestBody(req);
    
    try {
      // Get and validate user from token
      const user = await validateUserToken(req.headers.get('Authorization'));
      const email = user.email;
      
      // Initialize Stripe
      const stripe = initializeStripe();
      
      // Get or create customer
      const customer_id = await getOrCreateCustomer(stripe, email, user.id);
      
      // Get the request origin
      const origin = req.headers.get('origin') || 'http://localhost:5173';
      console.log("Using origin:", origin);
      
      // Create checkout session
      const couponCode = requestData && typeof requestData === 'object' && 'couponCode' in requestData
        ? requestData.couponCode
        : undefined;
      
      const sessionUrl = await createCheckoutSession(
        stripe, 
        customer_id, 
        user.id, 
        origin, 
        couponCode
      );
      
      return createSuccessResponse({ url: sessionUrl });
    } catch (error) {
      console.error("Error during checkout process:", error);
      
      if (error.message.includes("Authentication") || error.message.includes("Authorization")) {
        return createErrorResponse(error.message, 401);
      } else if (error.message.includes("already has an active subscription")) {
        return createErrorResponse(error.message, 400);
      } else {
        return createErrorResponse(error.message || "An error occurred during checkout", 500);
      }
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return createErrorResponse(error.message || "An unexpected error occurred", 500);
  }
});
