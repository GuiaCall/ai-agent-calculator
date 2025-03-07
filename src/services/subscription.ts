
import { supabase, logSupabaseResponse } from "@/integrations/supabase/client";

interface SubscriptionData {
  plan_type: string;
  status: string;
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
  // Get current user token to pass to edge function
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !session) {
    throw new Error(sessionError?.message || "No active session found. Please log in again.");
  }
  
  console.log("Got session, preparing to call edge function");
  
  try {
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

export async function activateTestSubscription(planType: string, status: string, days?: number) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Not logged in");
  }

  console.log(`Activating test ${planType} subscription for user:`, user.id);

  try {
    // Local fallback for development or when edge functions aren't available
    if (import.meta.env.DEV) {
      console.log("Development environment detected, using direct database update");
      
      const updateData: SubscriptionData = {
        plan_type: planType,
        status,
        updated_at: new Date().toISOString()
      };
      
      if (days) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + days);
        updateData.current_period_end = futureDate.toISOString();
      }
      
      // Check if subscription exists
      const { data: existingSubscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      let result;
      if (existingSubscription) {
        // Update existing subscription
        const { data, error } = await supabase
          .from('subscriptions')
          .update(updateData)
          .eq('user_id', user.id)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      } else {
        // Create new subscription
        const insertData: SubscriptionData & { user_id: string } = {
          user_id: user.id,
          plan_type: planType,
          status,
          updated_at: new Date().toISOString()
        };
        
        if (days) {
          const futureDate = new Date();
          futureDate.setDate(futureDate.getDate() + days);
          insertData.current_period_end = futureDate.toISOString();
        }
        
        const { data, error } = await supabase
          .from('subscriptions')
          .insert(insertData)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      }
      
      console.log("Subscription updated successfully (local):", result);
      return result;
    }
    
    // Production flow - use edge function
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
    
    return sessionData?.data || { plan_type: planType, status };
  } catch (error) {
    console.error("Error updating subscription:", error);
    
    // Fallback for when the edge function fails
    // Update the subscription directly in the database
    console.log("Edge function failed, falling back to direct database update");
    
    const updateData: SubscriptionData = {
      plan_type: planType, 
      status,
      updated_at: new Date().toISOString()
    };
    
    if (days) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);
      updateData.current_period_end = futureDate.toISOString();
    }
    
    try {
      // Check if subscription exists
      const { data: existingSubscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (existingSubscription) {
        // Update existing subscription
        const { data, error } = await supabase
          .from('subscriptions')
          .update(updateData)
          .eq('user_id', user.id)
          .select()
          .single();
        
        if (error) throw error;
        console.log("Subscription updated (fallback):", data);
        return data;
      } else {
        // Create new subscription
        const insertData: SubscriptionData & { user_id: string } = {
          user_id: user.id,
          plan_type: planType,
          status,
          updated_at: new Date().toISOString()
        };
        
        if (days) {
          const futureDate = new Date();
          futureDate.setDate(futureDate.getDate() + days);
          insertData.current_period_end = futureDate.toISOString();
        }
        
        const { data, error } = await supabase
          .from('subscriptions')
          .insert(insertData)
          .select()
          .single();
        
        if (error) throw error;
        console.log("Subscription created (fallback):", data);
        return data;
      }
    } catch (fallbackError) {
      console.error("Fallback update failed:", fallbackError);
      throw error; // Throw the original error since that's what we want to report
    }
  }
  
  // Fetch updated subscription after change
  return fetchUserSubscription(user.id);
}
