import { supabase } from "@/integrations/supabase/client";
import { InvoiceHistory, ClientInfo, AgencyInfo, Technology } from "@/types/invoice";
import { useToast } from "@/hooks/use-toast";

export const useInvoiceService = () => {
  const { toast } = useToast();

  const getSubscriptionInfo = async () => {
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .single();

    if (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }

    return {
      plan_type: subscription.plan_type,
      invoice_count: subscription.invoice_count || 0
    };
  };

  const saveInvoice = async (
    invoice: Omit<InvoiceHistory, 'id' | 'created_at'> & { technologies: Technology[] }
  ) => {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan_type, invoice_count')
      .single();

    if (subscription?.plan_type === 'free' && (subscription?.invoice_count || 0) >= 5) {
      toast({
        title: "Free plan limit reached",
        description: "Please upgrade to continue creating invoices",
        variant: "destructive",
      });
      return null;
    }

    const { data: invoiceData, error: invoiceError } = await supabase
      .from('invoices')
      .insert([{
        invoice_number: invoice.invoice_number,
        total_amount: invoice.total_amount,
        tax_rate: invoice.tax_rate,
        margin: invoice.margin,
        total_minutes: invoice.total_minutes,
        call_duration: invoice.call_duration,
        client_info: invoice.client_info,
        agency_info: invoice.agency_info
      }])
      .select()
      .single();

    if (invoiceError) {
      console.error('Error saving invoice:', invoiceError);
      return null;
    }

    const { error: paramsError } = await supabase
      .from('invoice_parameters')
      .insert([{
        invoice_id: invoiceData.id,
        technologies: invoice.technologies
      }]);

    if (paramsError) {
      console.error('Error saving invoice parameters:', paramsError);
      return null;
    }

    await supabase
      .from('subscriptions')
      .update({ invoice_count: (subscription?.invoice_count || 0) + 1 })
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

    return invoiceData;
  };

  const getInvoices = async (): Promise<InvoiceHistory[]> => {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        invoice_parameters (
          technologies
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching invoices:', error);
      return [];
    }

    return data.map((invoice: any) => ({
      ...invoice,
      client_info: invoice.client_info as ClientInfo,
      agency_info: invoice.agency_info as AgencyInfo,
      technologies: invoice.invoice_parameters?.[0]?.technologies || []
    }));
  };

  return {
    getSubscriptionInfo,
    saveInvoice,
    getInvoices
  };
};