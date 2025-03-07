
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

export function useSubscription() {
  const [loading, setLoading] = useState(false);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [currentSubscription, setCurrentSubscription] = useState(null);
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
        
        // Even if data is null, we still want to set it
        setCurrentSubscription(data || {});
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

  return {
    loading,
    loadingSubscription,
    couponCode,
    setCouponCode,
    handleSubscribe,
    currentSubscription
  };
}
