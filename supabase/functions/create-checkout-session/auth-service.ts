
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { createErrorResponse } from './utils.ts';

// Validate user token and return user data
export const validateUserToken = async (authHeader: string | null) => {
  if (!authHeader) {
    throw new Error("Authorization header is required");
  }

  const token = authHeader.replace('Bearer ', '');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Server configuration error");
  }

  const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  
  console.log("Validating user token");
  const { data, error: userError } = await supabaseClient.auth.getUser(token);
  
  if (userError || !data?.user) {
    console.error("Auth error:", userError);
    throw new Error("Authentication failed");
  }

  const user = data.user;
  if (!user.email) {
    throw new Error("No email found for authenticated user");
  }

  return user;
};

// Extract the token from authorization header
export const extractToken = (req: Request) => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    throw new Error("Authorization header is required");
  }
  return authHeader.replace('Bearer ', '');
};
