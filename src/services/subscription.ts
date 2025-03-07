
import { supabase, logSupabaseResponse } from "@/integrations/supabase/client";

export async function fetchUserSubscription(userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  
  console.log("Current subscription data:", data);
  return data || {};
}

export async function createCheckoutSession(couponCode?: string) {
  // Get current user token to pass to edge function
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !session) {
    throw new Error(sessionError?.message || "No active session found. Please log in again.");
  }
  
  console.log("Got session, preparing to call edge function");
  
  // Call the edge function with proper authorization
  const { data: sessionData, error: functionError } = await supabase.functions.invoke(
    'create-checkout-session', 
    {
      body: { couponCode: couponCode?.trim() || undefined },
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    }
  );
  
  console.log("Edge function response:", sessionData, functionError);
  
  if (functionError) {
    console.error("Edge function error:", functionError);
    throw new Error(functionError.message || "Failed to create checkout session");
  }
  
  if (!sessionData?.url) {
    console.error("No checkout URL returned:", sessionData);
    throw new Error('No checkout URL returned from server');
  }
  
  return sessionData.url;
}

export async function activateTestSubscription(planType: string, status: string, days?: number) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Not logged in");
  }

  console.log(`Activating test ${planType} subscription for user:`, user.id);

  // Get the current session for the authorization token
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error("No active session found. Please log in again.");
  }

  // Use edge function to handle subscription update through service role
  const { data: sessionData, error: functionError } = await supabase.functions.invoke(
    'update-subscription-status', 
    {
      body: { 
        plan_type: planType,
        status,
        days
      },
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    }
  );
  
  if (functionError) {
    console.error("Function error:", functionError);
    throw new Error(functionError.message || "Failed to update subscription status");
  }
  
  console.log("Subscription updated successfully:", sessionData);
  
  // Fetch updated subscription after change
  return fetchUserSubscription(user.id);
}
