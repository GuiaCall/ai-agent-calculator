
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useSubscriptionStatus() {
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true);

  useEffect(() => {
    const checkInvoices = async () => {
      setIsCheckingSubscription(true);
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !sessionData?.session?.user) {
          console.error("Session error:", sessionError);
          setIsCheckingSubscription(false);
          return;
        }
        
        const user = sessionData.session.user;
        console.log("Checking invoices for user:", user.id);

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

    checkInvoices();

    // Subscribe to invoice changes
    const invoiceChannel = supabase
      .channel('user_invoice_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoices'
        },
        (payload) => {
          console.log('Invoice change detected in calculator:', payload);
          checkInvoices();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(invoiceChannel);
    };
  }, []);

  return {
    invoiceCount,
    isCheckingSubscription,
    // Set these to always return unlimited access
    isSubscribed: true,
    isSubscriptionActive: true
  };
}
