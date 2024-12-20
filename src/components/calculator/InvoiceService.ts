import { supabase } from "@/integrations/supabase/client";
import { InvoiceHistory, ClientInfo, AgencyInfo, Technology } from "@/types/invoice";
import { useToast } from "@/hooks/use-toast";

export function useInvoiceService() {
  const { toast } = useToast();

  const checkInvoiceLimit = async () => {
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('plan_type, invoice_count')
      .single();

    if (error) {
      console.error('Error checking invoice limit:', error);
      return false;
    }

    return subscription?.plan_type === 'free' && (subscription?.invoice_count || 0) >= 5;
  };

  const saveInvoice = async (invoice: Omit<InvoiceHistory, 'id' | 'created_at'>) => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data: invoiceData, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        user_id: user.id,
        invoice_number: invoice.invoice_number,
        total_amount: invoice.total_amount,
        tax_rate: invoice.tax_rate,
        margin: invoice.margin,
        total_minutes: invoice.total_minutes,
        call_duration: invoice.call_duration,
        client_info: invoice.client_info,
        agency_info: invoice.agency_info,
        date: new Date().toISOString()
      })
      .select()
      .single();

    if (invoiceError) {
      console.error('Error saving invoice:', invoiceError);
      return null;
    }

    // Save technologies as parameters
    if (invoice.technologies.length > 0) {
      const { error: paramsError } = await supabase
        .from('invoice_parameters')
        .insert(
          invoice.technologies.map(tech => ({
            invoice_id: invoiceData.id,
            technology_name: tech.name,
            cost_per_minute: tech.costPerMinute,
            is_selected: tech.isSelected
          }))
        );

      if (paramsError) {
        console.error('Error saving invoice parameters:', paramsError);
        return null;
      }
    }

    // Update subscription invoice count
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({ invoice_count: (subscription?.invoice_count || 0) + 1 })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating subscription:', updateError);
    }

    return invoiceData;
  };

  const loadInvoices = async (): Promise<InvoiceHistory[]> => {
    const { data: invoices, error: invoicesError } = await supabase
      .from('invoices')
      .select(`
        *,
        invoice_parameters (*)
      `)
      .order('created_at', { ascending: false });

    if (invoicesError) {
      console.error('Error loading invoices:', invoicesError);
      throw invoicesError;
    }

    return invoices.map(invoice => ({
      ...invoice,
      client_info: invoice.client_info as ClientInfo,
      agency_info: invoice.agency_info as AgencyInfo,
      technologies: invoice.invoice_parameters.map((param: any) => ({
        id: param.technology_name,
        name: param.technology_name,
        isSelected: param.is_selected,
        costPerMinute: param.cost_per_minute
      })),
      date: invoice.date
    }));
  };

  const deleteInvoice = async (id: string) => {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting invoice:', error);
      return false;
    }

    return true;
  };

  return {
    checkInvoiceLimit,
    saveInvoice,
    loadInvoices,
    deleteInvoice
  };
}