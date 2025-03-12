
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useInvoiceCount } from "./useInvoiceCount";

export function useSubscriptionStatus() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubscriptionActive, setIsSubscriptionActive] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState("");
  const [refreshingStatus, setRefreshingStatus] = useState(false);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true);
  const { invoiceCount, fetchInvoiceCount } = useInvoiceCount();

  const fetchSubscriptionStatus = async (userId: string, forceRefresh = false) => {
    if (forceRefresh) {
      setRefreshingStatus(true);
    }
    
    setIsCheckingSubscription(true);
    
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
        const isPro = subscription.plan_type === 'pro';
        const isActive = subscription.status === 'active';
        
        setIsSubscribed(isPro);
        setIsSubscriptionActive(isActive);
        setSubscriptionStatus(subscription.status);
        
        console.log("Current subscription:", subscription);
        
        // Also fetch invoice count when subscription status is checked
        if (userId) {
          await fetchInvoiceCount(userId);
        }
        
        return subscription;
      } else {
        console.log("No subscription found for user");
        
        // Reset subscription states
        setIsSubscribed(false);
        setIsSubscriptionActive(false);
        setSubscriptionStatus('none');
        
        // Still fetch invoice count
        if (userId) {
          await fetchInvoiceCount(userId);
        }
        
        return null;
      }
    } catch (err) {
      console.error("Subscription fetch error:", err);
      return null;
    } finally {
      setIsCheckingSubscription(false);
      if (forceRefresh) {
        setRefreshingStatus(false);
      }
    }
  };

  return {
    isSubscribed,
    isSubscriptionActive,
    subscriptionStatus,
    refreshingStatus,
    isCheckingSubscription,
    invoiceCount,
    fetchSubscriptionStatus,
  };
}
