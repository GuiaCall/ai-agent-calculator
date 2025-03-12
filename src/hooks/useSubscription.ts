
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function useSubscription() {
  const [refreshingStatus, setRefreshingStatus] = useState(false);
  const [invoiceCount, setInvoiceCount] = useState(0);
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const fetchUserData = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshingStatus(true);
      }
      
      // Always get a fresh session to ensure token is valid
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData?.session?.user) {
        console.log("No active session found, redirecting to login");
        navigate('/login');
        return;
      }

      const user = sessionData.session.user;
      console.log("Current user:", user.id);

      try {
        const { count, error } = await supabase
          .from('invoices')
          .select('*', { count: 'exact' })
          .eq('user_id', user.id)
          .eq('is_deleted', false);
        
        if (error) {
          console.error("Error fetching invoice count:", error);
          return;
        }

        setInvoiceCount(count || 0);
        console.log("Invoice count:", count);
      } catch (err) {
        console.error("Invoice count fetch error:", err);
      }
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    } finally {
      setRefreshingStatus(false);
      if (forceRefresh) {
        setRefreshingStatus(false);
      }
    }
  };

  useEffect(() => {
    fetchUserData();

    const channel = supabase
      .channel('invoice_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoices'
        },
        (payload: any) => {
          console.log('Invoice change detected:', payload);
          fetchUserData(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    refreshingStatus,
    invoiceCount,
    handleRefreshStatus: () => fetchUserData(true)
  };
}
