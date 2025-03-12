
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function useInvoiceCount() {
  const [totalInvoices, setTotalInvoices] = useState<number | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const fetchInvoiceCount = async () => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData?.session?.user) {
        console.log('No user found or session error:', sessionError);
        navigate('/login');
        return;
      }

      const user = sessionData.session.user;
      console.log('Fetching invoice count for user:', user.id);

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
      console.error('Error fetching invoice count:', error);
      toast({
        title: t("errorFetchingData"),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchInvoiceCount();

    const channel = supabase
      .channel('invoice_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoices'
        },
        () => {
          console.log('Invoice change detected, updating count');
          fetchInvoiceCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { totalInvoices };
}
