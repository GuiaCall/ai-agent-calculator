
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSubscriptionStatus } from "./useSubscriptionStatus";
import { useInvoiceCount } from "./useInvoiceCount";
import { useCheckoutSuccess } from "./useCheckoutSuccess";

export function useSubscription() {
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const { invoiceCount, fetchInvoiceCount } = useInvoiceCount();
  const { isSubscribed, subscriptionStatus, refreshingStatus, fetchSubscriptionStatus } = useSubscriptionStatus();
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Add debounce to prevent multiple subscription requests
  const [lastAttempt, setLastAttempt] = useState(0);

  const fetchUserData = async (forceRefresh = false) => {
    try {
      // Always get a fresh session to ensure token is valid
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData?.session?.user) {
        console.log("No active session found, redirecting to login");
        navigate('/login');
        return;
      }

      const user = sessionData.session.user;
      console.log("Current user:", user.id);

      // Fetch subscription status
      const subscription = await fetchSubscriptionStatus(user.id, forceRefresh);
      
      // Fetch invoice count
      await fetchInvoiceCount(user.id);
      
      // Handle subscription verification toast
      if (forceRefresh && subscription && subscription.plan_type === 'pro' && subscription.status === 'active') {
        toast({
          title: t("subscriptionVerified"),
          description: t("proFeaturesActive"),
        });
        
        // Force reload the page to ensure all components reflect the new subscription status
        window.location.reload();
      }
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    }
  };

  const handleSubscribe = async () => {
    // Prevent multiple rapid clicks
    const now = Date.now();
    if (now - lastAttempt < 3000) {
      console.log("Preventing duplicate request");
      return;
    }
    setLastAttempt(now);
    
    try {
      setLoading(true);
      console.log("Starting subscription process");
      
      // Get a fresh session with a fresh token
      const { data: sessionData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError || !sessionData?.session) {
        console.error("Session refresh error:", refreshError);
        throw new Error(refreshError?.message || "Failed to get session. Please log in again.");
      }
      
      const session = sessionData.session;
      const token = session.access_token;
      
      console.log("Got fresh session, preparing to call edge function");
      console.log("Access token exists:", !!token);
      
      if (!token) {
        throw new Error("No access token available. Please log in again.");
      }
      
      // Add additional logging
      console.log("Making call to create-checkout-session function...");
      
      // Make sure we explicitly set the Authorization header
      const { data: checkoutData, error: functionError } = await supabase.functions.invoke(
        'create-checkout-session', 
        {
          body: { couponCode: couponCode.trim() || undefined },
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      console.log("Edge function response:", checkoutData, functionError);
      
      if (functionError) {
        console.error("Edge function error:", functionError);
        throw new Error(functionError.message || "Failed to create checkout session");
      }
      
      if (!checkoutData?.url) {
        console.error("No checkout URL returned:", checkoutData);
        throw new Error('No checkout URL returned from server');
      }
      
      console.log("Redirecting to Stripe checkout:", checkoutData.url);
      window.location.href = checkoutData.url;
    } catch (error: any) {
      console.error("Subscription error:", error);
      toast({
        title: t("error"),
        description: error.message || t("operationFailed"),
        variant: "destructive",
      });
      // Reset loading state so user can try again
      setLoading(false);
    }
  };

  // Use the checkout success hook
  useCheckoutSuccess(fetchUserData);

  useEffect(() => {
    fetchUserData();

    const channel = supabase
      .channel('subscription_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions'
        },
        (payload: any) => {
          console.log('Subscription change detected:', payload);
          fetchUserData(true);
          
          // If subscription becomes active, reload the page
          const newData = payload.new;
          if (newData && newData.plan_type === 'pro' && newData.status === 'active') {
            window.location.reload();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    loading,
    refreshingStatus,
    invoiceCount,
    couponCode,
    isSubscribed,
    subscriptionStatus,
    setCouponCode,
    handleSubscribe,
    handleRefreshStatus: () => fetchUserData(true)
  };
}
