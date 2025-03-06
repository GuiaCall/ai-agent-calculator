
// Common utilities for the checkout session edge function

// CORS headers for cross-origin requests
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper to create error responses with proper headers
export const createErrorResponse = (message: string, status = 500) => {
  console.error(message);
  return new Response(
    JSON.stringify({ error: message }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status,
    }
  );
};

// Helper to create success responses with proper headers
export const createSuccessResponse = (data: any) => {
  return new Response(
    JSON.stringify(data),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    }
  );
};

// Parse request body with error handling
export const parseRequestBody = async (req: Request) => {
  try {
    console.log("Parsing request body");
    if (req.body) {
      const body = await req.json();
      console.log("Request body:", JSON.stringify(body));
      return body || {};
    } else {
      console.log("No request body provided");
      return {};
    }
  } catch (e) {
    console.error("Failed to parse request body:", e);
    return {};
  }
};
