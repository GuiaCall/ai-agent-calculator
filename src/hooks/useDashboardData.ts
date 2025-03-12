
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

export function useDashboardData() {
  const [totalInvoices, setTotalInvoices] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        
        if (session?.user) {
          setUserEmail(session.user.email || "");
          
          // Get total invoices
          const { count, error: invoiceError } = await supabase
            .from('invoices')
            .select('*', { count: 'exact' })
            .eq('user_id', session.user.id)
            .eq('is_deleted', false);
            
          if (invoiceError) throw invoiceError;
          setTotalInvoices(count || 0);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: t("error"),
          description: t("errorFetchingData"),
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [toast, t]);

  return {
    totalInvoices,
    userEmail,
  };
}
