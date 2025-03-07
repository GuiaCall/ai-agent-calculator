
import { useState, useEffect } from "react";
import { supabase, logSupabaseResponse, subscribeToSubscriptionChanges } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

export function useSubscription() {
  const [loading, setLoading] = useState(false);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [testMode, setTestMode] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();
  
  // Fetch current subscription status
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setLoadingSubscription(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          // If no user, set subscription to empty object to avoid loading forever
          setCurrentSubscription({});
          setLoadingSubscription(false);
          return;
        }

        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;
        
        console.log("Current subscription data:", data);
        
        // Even if data is null, we still want to set it
        setCurrentSubscription(data || {});
        
        // Set up subscription to changes
        const subscription = subscribeToSubscriptionChanges(user.id, () => {
          console.log("Subscription change detected, refreshing...");
          fetchSubscription();
        });
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error fetching subscription:", error);
        // Set empty subscription to prevent infinite loading
        setCurrentSubscription({});
      } finally {
        setLoadingSubscription(false);
      }
    };

    fetchSubscription();
  }, []);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      console.log("Starting subscription process");
      
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
          body: { couponCode: couponCode.trim() || undefined },
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
      
      // Redirect to Stripe checkout
      console.log("Redirecting to Stripe checkout:", sessionData.url);
      window.location.href = sessionData.url;
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
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: t("error"),
          description: t("notLoggedIn"),
          variant: "destructive",
        });
        return;
      }

      console.log("Activating test pro subscription for user:", user.id);

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
            plan_type: 'pro',
            status: 'active',
            days: 30 // Set expiry to 30 days from now
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
      
      // Fetch updated subscription
      const { data: updatedSubscription, error: refetchError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (refetchError) {
        console.error("Error fetching updated subscription:", refetchError);
      } else {
        console.log("Updated subscription:", updatedSubscription);
        setCurrentSubscription(updatedSubscription);
      }

      toast({
        title: t("success"),
        description: t("testProActivated"),
      });
    } catch (error) {
      console.error("Error activating test pro subscription:", error);
      toast({
        title: t("error"),
        description: error.message || t("operationFailed"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to reset subscription to free plan
  const resetToFreePlan = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: t("error"),
          description: t("notLoggedIn"),
          variant: "destructive",
        });
        return;
      }

      console.log("Resetting to free plan for user:", user.id);

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
            plan_type: 'free',
            status: 'inactive'
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

      // Fetch updated subscription
      const { data: updatedSubscription, error: refetchError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (refetchError) {
        console.error("Error fetching updated subscription:", refetchError);
      } else {
        console.log("Updated subscription:", updatedSubscription);
        setCurrentSubscription(updatedSubscription);
      }

      toast({
        title: t("success"),
        description: t("resetToFreePlan"),
      });
    } catch (error) {
      console.error("Error resetting to free plan:", error);
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
    currentSubscription,
    testMode,
    setTestMode,
    activateTestProSubscription,
    resetToFreePlan
  };
}
