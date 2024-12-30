import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { InvoiceHistory } from "@/types/invoice";
import { useToast } from "@/hooks/use-toast";

export function useInvoices() {
  const [invoices, setInvoices] = useState<InvoiceHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const transformedData: InvoiceHistory[] = data.map(invoice => ({
          id: invoice.id,
          invoice_number: invoice.invoice_number,
          created_at: invoice.created_at || '',
          client_info: typeof invoice.client_info === 'string' 
            ? JSON.parse(invoice.client_info)
            : invoice.client_info,
          agency_info: typeof invoice.agency_info === 'string'
            ? JSON.parse(invoice.agency_info)
            : invoice.agency_info,
          total_amount: Number(invoice.total_amount),
          tax_rate: Number(invoice.tax_rate),
          margin: Number(invoice.margin),
          setup_cost: Number(invoice.setup_cost),
          monthly_service_cost: Number(invoice.monthly_service_cost),
          total_minutes: invoice.total_minutes,
          call_duration: invoice.call_duration,
          user_id: invoice.user_id,
          is_deleted: invoice.is_deleted || false
        }));
        
        setInvoices(transformedData);
      }
    } catch (error: any) {
      console.error('Error fetching invoices:', error);
      toast({
        title: "Error fetching invoices",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();

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
          console.log('Invoice change detected, refreshing...');
          fetchInvoices();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ is_deleted: true })
        .eq('id', id);

      if (error) throw error;

      setInvoices(prev => prev.filter(inv => inv.id !== id));
      
      toast({
        title: "Invoice deleted",
        description: "The invoice has been successfully deleted.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting invoice",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    invoices,
    isLoading,
    handleDelete,
    refreshInvoices: fetchInvoices
  };
}