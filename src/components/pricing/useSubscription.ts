
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { fetchUserSubscription, createCheckoutSession } from "@/services/subscription";
import { useSubscriptionListener } from "@/hooks/useSubscriptionListener";

export function useSubscription() {
  const [loading, setLoading] = useState(false);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const { toast } = useToast();
  const { t } = useTranslation();
  
  // Function to fetch subscription data
  const fetchSubscriptionData = useCallback(async () => {
    try {
      setLoadingSubscription(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // If no user, set subscription to empty object to avoid loading forever
        setCurrentSubscription({});
        setLoadingSubscription(false);
        return;
      }

      const subscription = await fetchUserSubscription(user.id);
      setCurrentSubscription(subscription);
      
    } catch (error) {
      console.error("Error fetching subscription:", error);
      // Set empty subscription to prevent infinite loading
      setCurrentSubscription({});
      
      toast({
        title: t("error"),
        description: t("errorFetchingSubscription"),
        variant: "destructive",
      });
    } finally {
      setLoadingSubscription(false);
    }
  }, [t, toast]);

  // Fetch current subscription status on mount
  useEffect(() => {
    fetchSubscriptionData();
  }, [fetchSubscriptionData]);
  
  // Set up subscription listener
  useSubscriptionListener(fetchSubscriptionData);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      console.log("Starting subscription process");
      
      const url = await createCheckoutSession(couponCode);
      
      // Redirect to Stripe checkout
      console.log("Redirecting to Stripe checkout:", url);
      window.location.href = url;
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: t("error"),
        description: error.message || t("operationFailed"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    loadingSubscription,
    couponCode,
    setCouponCode,
    handleSubscribe,
    currentSubscription
  };
}
