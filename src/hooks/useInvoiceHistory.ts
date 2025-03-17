
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { InvoiceHistory } from '@/types/invoice';
import { useToast } from './use-toast';
import { safelyParseJSON } from '@/utils/jsonUtils';

export function useInvoiceHistory() {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<InvoiceHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const fetchInvoices = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching invoices:', error);
        toast({
          title: "Error fetching invoices",
          description: error.message,
          variant: "destructive",
        });
        setError(error.message);
        return;
      }

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
          is_deleted: invoice.is_deleted || false,
          last_exported_at: invoice.last_exported_at
        }));
        
        setInvoices(transformedData);
      }
    } catch (error: any) {
      console.error('Error in fetchInvoices:', error);
      toast({
        title: "Error fetching invoices",
        description: error.message,
        variant: "destructive",
      });
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();

    // Subscribe to realtime changes
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
          fetchInvoices(); // Refetch when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { invoices, loading, error };
}
