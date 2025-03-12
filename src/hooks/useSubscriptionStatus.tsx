
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

export function useSubscriptionStatus() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubscriptionActive, setIsSubscriptionActive] = useState(false);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true);

  useEffect(() => {
    const checkSubscriptionAndInvoices = async () => {
      setIsCheckingSubscription(true);
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !sessionData?.session?.user) {
          console.error("Session error:", sessionError);
          setIsCheckingSubscription(false);
          return;
        }
        
        const user = sessionData.session.user;
        console.log("Checking subscription for user:", user.id);

        // Get subscription details
        try {
          const { data: subscription, error: subError } = await supabase
            .from('subscriptions')
            .select('plan_type, status')
            .eq('user_id', user.id)
            .maybeSingle();

          if (subError) {
            console.error("Subscription fetch error:", subError);
          }

          console.log("Subscription check result:", subscription);
          
          const isPro = subscription?.plan_type === 'pro';
          const isActive = subscription?.status === 'active';
          
          setIsSubscribed(isPro);
          setIsSubscriptionActive(isActive);
          
          if (isPro && isActive) {
            console.log("User has active pro subscription");
          } else if (isPro && !isActive) {
            console.log("User has pro subscription but it's not active");
          } else {
            console.log("User has free subscription");
          }
        } catch (subErr) {
          console.error("Error processing subscription data:", subErr);
        }

        // Get invoice count
        try {
          const { count, error: countError } = await supabase
            .from('invoices')
            .select('*', { count: 'exact' })
            .eq('user_id', user.id)
            .eq('is_deleted', false);

          if (countError) {
            console.error("Invoice count error:", countError);
          }

          setInvoiceCount(count || 0);
          console.log("Invoice count:", count);
        } catch (invErr) {
          console.error("Error processing invoice count:", invErr);
        }
      } catch (error) {
        console.error("Error checking subscription:", error);
      } finally {
        setIsCheckingSubscription(false);
      }
    };

    checkSubscriptionAndInvoices();

    // Subscribe to subscription changes
    const subscriptionChannel = supabase
      .channel('user_subscription_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions'
        },
        (payload) => {
          console.log('Subscription change detected in calculator:', payload);
          checkSubscriptionAndInvoices();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscriptionChannel);
    };
  }, []);

  return {
    invoiceCount,
    isSubscribed,
    isSubscriptionActive,
    isCheckingSubscription
  };
}
