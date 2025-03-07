
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { fetchUserSubscription, createCheckoutSession, activateTestSubscription } from "@/services/subscription";
import { useSubscriptionListener } from "@/hooks/useSubscriptionListener";

export function useSubscription() {
  const [loading, setLoading] = useState(false);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [testMode, setTestMode] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
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

  // Function to test the pro subscription without payment
  const activateTestProSubscription = async () => {
    setLoading(true);
    try {
      const updatedSubscription = await activateTestSubscription('pro', 'active', 30);
      setCurrentSubscription(updatedSubscription);

      toast({
        title: t("success"),
        description: t("testProActivated"),
      });
    } catch (error) {
      console.error("Error activating test pro subscription:", error);
      
      if (retryCount < 3) {
        // Retry the operation with the fallback mechanism
        setRetryCount(prev => prev + 1);
        toast({
          title: t("retrying"),
          description: t("retryingOperation"),
        });
        
        try {
          // Try the direct database approach as a fallback
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) throw new Error("Not logged in");
          
          const futureDate = new Date();
          futureDate.setDate(futureDate.getDate() + 30);
          
          // Update subscription directly
          const { data, error } = await supabase
            .from('subscriptions')
            .upsert({
              user_id: user.id,
              plan_type: 'pro',
              status: 'active',
              current_period_end: futureDate.toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single();
          
          if (error) throw error;
          
          setCurrentSubscription(data);
          
          toast({
            title: t("success"),
            description: t("testProActivated"),
          });
        } catch (fallbackError) {
          console.error("Fallback error:", fallbackError);
          toast({
            title: t("error"),
            description: t("couldNotActivateSubscription"),
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: t("error"),
          description: t("couldNotActivateSubscription"),
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to reset subscription to free plan
  const resetToFreePlan = async () => {
    setLoading(true);
    try {
      const updatedSubscription = await activateTestSubscription('free', 'inactive');
      setCurrentSubscription(updatedSubscription);

      toast({
        title: t("success"),
        description: t("resetToFreePlan"),
      });
    } catch (error) {
      console.error("Error resetting to free plan:", error);
      
      if (retryCount < 3) {
        // Retry the operation with the fallback mechanism
        setRetryCount(prev => prev + 1);
        toast({
          title: t("retrying"),
          description: t("retryingOperation"),
        });
        
        try {
          // Try the direct database approach as a fallback
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) throw new Error("Not logged in");
          
          // Update subscription directly
          const { data, error } = await supabase
            .from('subscriptions')
            .upsert({
              user_id: user.id,
              plan_type: 'free',
              status: 'inactive',
              updated_at: new Date().toISOString()
            })
            .select()
            .single();
          
          if (error) throw error;
          
          setCurrentSubscription(data);
          
          toast({
            title: t("success"),
            description: t("resetToFreePlan"),
          });
        } catch (fallbackError) {
          console.error("Fallback error:", fallbackError);
          toast({
            title: t("error"),
            description: error.message || t("operationFailed"),
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: t("error"),
          description: error.message || t("operationFailed"),
          variant: "destructive",
        });
      }
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
    currentSubscription,
    testMode,
    setTestMode,
    activateTestProSubscription,
    resetToFreePlan
  };
}
