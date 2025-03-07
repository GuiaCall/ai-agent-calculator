
import { useState, useEffect } from "react";
import { supabase, logSupabaseResponse } from "@/integrations/supabase/client";
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

      // Check if subscription record exists
      const { data: existingSubscription, error: fetchError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (fetchError) {
        console.error("Error fetching subscription:", fetchError);
        throw new Error(fetchError.message);
      }

      const currentDate = new Date();
      const futureDate = new Date();
      futureDate.setDate(currentDate.getDate() + 30); // Set expiry to 30 days from now

      if (existingSubscription) {
        // Update existing subscription
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({
            plan_type: 'pro',
            status: 'active',
            current_period_end: futureDate.toISOString(),
            updated_at: currentDate.toISOString()
          })
          .eq('user_id', user.id);

        if (updateError) {
          console.error("Error updating subscription:", updateError);
          throw new Error(updateError.message);
        }
      } else {
        // Create new subscription
        const { error: insertError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: user.id,
            plan_type: 'pro',
            status: 'active',
            current_period_end: futureDate.toISOString()
          });

        if (insertError) {
          console.error("Error creating subscription:", insertError);
          throw new Error(insertError.message);
        }
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

      const { error } = await supabase
        .from('subscriptions')
        .update({
          plan_type: 'free',
          status: 'inactive',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) {
        console.error("Error resetting subscription:", error);
        throw new Error(error.message);
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
