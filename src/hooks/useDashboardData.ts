
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

// Define a proper type for the subscription data
export interface SubscriptionData {
  plan_type: string;
  status: string;
  current_period_end?: string;
  stripe_subscription_id?: string;
  stripe_customer_id?: string;
  id?: string;
}

export function useDashboardData(checkoutSuccess: boolean) {
  const [totalInvoices, setTotalInvoices] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [subscription, setSubscription] = useState<SubscriptionData>({ 
    plan_type: "free", 
    status: "active" 
  });
  const [refreshingStatus, setRefreshingStatus] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchDashboardData = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshingStatus(true);
      }

      // Always get a fresh session to ensure token validity
      const { data: sessionData, error: sessionError } = await supabase.auth.refreshSession();
      if (sessionError || !sessionData?.session?.user) {
        console.log('No user found or session error:', sessionError);
        navigate('/login');
        return;
      }

      const user = sessionData.session.user;
      console.log('Fetching dashboard data for user:', user.id);
      setUserEmail(user.email || "");

      // Fetch subscription data
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (subscriptionError) {
        console.error('Subscription error:', subscriptionError);
        throw subscriptionError;
      }

      if (subscriptionData) {
        console.log('Subscription data:', subscriptionData);
        // Use type assertion to ensure TypeScript recognizes the subscription data
        setSubscription(subscriptionData as SubscriptionData);
        
        // If the user has just completed checkout and has an active subscription, show success message
        if (forceRefresh && subscriptionData.plan_type === 'pro' && subscriptionData.status === 'active') {
          toast({
            title: t("subscriptionVerified"),
            description: t("proFeaturesActive"),
          });
        }
      }

      // Fetch non-deleted invoices count
      const { count, error: countError } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_deleted', false);

      if (countError) {
        console.error('Count error:', countError);
        throw countError;
      }

      console.log('Invoice count:', count);
      setTotalInvoices(count || 0);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: t("errorFetchingData"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      if (forceRefresh) {
        setRefreshingStatus(false);
      }
    }
  };

  useEffect(() => {
    console.log('Dashboard component mounted');
    fetchDashboardData();

    // Show checkout success toast if redirected from successful checkout
    if (checkoutSuccess) {
      toast({
        title: t("checkoutSuccessful"),
        description: t("subscriptionProcessing"),
        duration: 8000,
      });
      
      // Remove the query parameter from the URL but don't trigger a reload
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      
      // Aggressively check for subscription updates for the next minute
      let checkCount = 0;
      const maxChecks = 15; // Increased checks
      
      const checkInterval = setInterval(() => {
        checkCount++;
        console.log(`Checking subscription status update ${checkCount}/${maxChecks}`);
        fetchDashboardData(true);
        
        // If we detect a pro subscription, trigger a page reload to refresh all components
        if (subscription.plan_type === 'pro' && subscription.status === 'active') {
          console.log("Pro subscription detected, reloading page");
          clearInterval(checkInterval);
          window.location.reload();
        }
        
        if (checkCount >= maxChecks) {
          clearInterval(checkInterval);
          console.log("Finished polling for subscription status updates");
        }
      }, 5000);
      
      return () => clearInterval(checkInterval);
    }

    const channel = supabase
      .channel('dashboard_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoices'
        },
        (payload) => {
          console.log('Invoice change detected in dashboard:', payload);
          fetchDashboardData();
        }
      )
      .subscribe();

    // Also listen for subscription changes
    const subscriptionChannel = supabase
      .channel('subscription_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions'
        },
        (payload: any) => {
          console.log('Subscription change detected in dashboard:', payload);
          fetchDashboardData(true);
          
          // Fix TypeScript error by properly typing and checking the payload
          const newData = payload.new as SubscriptionData | null;
          
          // Force page reload when subscription changes to ensure UI reflects new status
          if (newData && newData.plan_type === 'pro' && newData.status === 'active') {
            console.log("Pro subscription update detected, reloading page");
            window.location.reload();
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up dashboard subscription');
      supabase.removeChannel(channel);
      supabase.removeChannel(subscriptionChannel);
    };
  }, []);

  return {
    totalInvoices,
    userEmail,
    subscription,
    refreshingStatus,
    handleRefreshStatus: () => fetchDashboardData(true)
  };
}
