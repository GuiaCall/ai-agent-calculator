
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useSubscriptionStatus() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState("");
  const [refreshingStatus, setRefreshingStatus] = useState(false);

  const fetchSubscriptionStatus = async (userId: string, forceRefresh = false) => {
    if (forceRefresh) {
      setRefreshingStatus(true);
    }
    
    try {
      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .select('plan_type, status')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (subError) {
        console.error("Error fetching subscription:", subError);
        return null;
      }

      if (subscription) {
        setIsSubscribed(subscription.plan_type === 'pro');
        setSubscriptionStatus(subscription.status);
        console.log("Current subscription:", subscription);
        return subscription;
      } else {
        console.log("No subscription found for user");
        return null;
      }
    } catch (err) {
      console.error("Subscription fetch error:", err);
      return null;
    } finally {
      if (forceRefresh) {
        setRefreshingStatus(false);
      }
    }
  };

  return {
    isSubscribed,
    subscriptionStatus,
    refreshingStatus,
    fetchSubscriptionStatus,
  };
}
