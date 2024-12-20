import { supabase } from "@/integrations/supabase/client";
import { AgencyInfo, ClientInfo, InvoiceHistory } from "@/types/invoice";
import { Database } from "@/types/database";
import { Technology } from "@/types/calculator";

export async function checkInvoiceLimit(): Promise<boolean> {
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('plan_type, invoice_count')
    .single();

  if (error || !subscription) return false;

  return !(subscription.plan_type === 'free' && 
    (subscription.invoice_count || 0) >= 3);
}

export async function saveInvoice(
  invoice_number: string,
  total_amount: number,
  tax_rate: number,
  margin: number,
  total_minutes: number,
  call_duration: number,
  client_info: ClientInfo,
  agency_info: AgencyInfo,
  technologies: Technology[]
): Promise<InvoiceHistory | null> {
  const user = await supabase.auth.getUser();
  const user_id = user.data.user?.id;

  if (!user_id) {
    throw new Error('User not authenticated');
  }

  const { data: invoiceData, error: invoiceError } = await supabase
    .from('invoices')
    .insert({
      user_id,
      invoice_number,
      total_amount,
      tax_rate,
      margin,
      total_minutes,
      call_duration,
      client_info,
      agency_info
    })
    .select()
    .single();

  if (invoiceError || !invoiceData) {
    throw new Error('Error saving invoice');
  }

  const techParams = technologies
    .filter(tech => tech.isSelected)
    .map(tech => ({
      invoice_id: invoiceData.id,
      technology_name: tech.name,
      cost_per_minute: tech.costPerMinute,
      is_selected: tech.isSelected
    }));

  const { error: paramsError } = await supabase
    .from('invoice_parameters')
    .insert(techParams);

  if (paramsError) {
    throw new Error('Error saving invoice parameters');
  }

  await supabase.rpc('increment_invoice_count');

  return {
    ...invoiceData,
    date: new Date(invoiceData.created_at),
    client_info: invoiceData.client_info as ClientInfo,
    agency_info: invoiceData.agency_info as AgencyInfo,
  };
}

export async function loadInvoices(): Promise<InvoiceHistory[]> {
  const { data: invoices, error } = await supabase
    .from('invoices')
    .select(`
      *,
      invoice_parameters (*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error('Error loading invoices');
  }

  return (invoices || []).map(invoice => ({
    ...invoice,
    date: new Date(invoice.created_at),
    client_info: invoice.client_info as ClientInfo,
    agency_info: invoice.agency_info as AgencyInfo,
  }));
}

export async function deleteInvoice(id: string) {
  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error('Error deleting invoice');
  }
}