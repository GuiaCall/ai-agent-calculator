
import { supabase } from "@/integrations/supabase/client";

// Define valid plan types to match database constraint
export type PlanType = 'free' | 'pro';
export type SubscriptionStatus = 'active' | 'inactive' | 'canceled';

interface SubscriptionData {
  plan_type: PlanType;
  status: SubscriptionStatus;
  updated_at: string;
  current_period_end?: string;
}

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
  try {
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
  } catch (error) {
    console.error("Failed to invoke edge function:", error);
    throw new Error("Could not connect to the subscription service. Please try again later or contact support.");
  }
}
