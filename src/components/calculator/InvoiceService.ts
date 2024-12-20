import { supabase } from "@/integrations/supabase/client";
import { AgencyInfo, ClientInfo } from "@/types/invoice";
import { Database } from "@/types/database";

export interface Technology {
  id: string;
  name: string;
  isSelected: boolean;
  costPerMinute: number;
}

type Invoice = Database['public']['Tables']['invoices']['Row'];
type InvoiceParameter = Database['public']['Tables']['invoice_parameters']['Row'];

export async function checkInvoiceLimit() {
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan_type, invoice_limit, invoices_generated')
    .single();

  if (!subscription) return false;

  return !(subscription.plan_type === 'free' && 
    subscription.invoices_generated >= (subscription.invoice_limit || 3));
}

export async function saveInvoice(
  invoiceNumber: string,
  totalCost: number,
  taxRate: number,
  margin: number,
  totalMinutes: number,
  callDuration: number,
  clientInfo: ClientInfo,
  agencyInfo: AgencyInfo,
  technologies: Technology[]
) {
  const { data: invoiceData, error: invoiceError } = await supabase
    .from('invoices')
    .insert({
      invoice_number: invoiceNumber,
      total_amount: totalCost,
      tax_rate: taxRate,
      margin: margin,
      total_minutes: totalMinutes,
      call_duration: callDuration,
      client_info: clientInfo,
      agency_info: agencyInfo,
      user_id: (await supabase.auth.getUser()).data.user?.id
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

  return invoiceData;
}

export async function loadInvoices(): Promise<Invoice[]> {
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

  return invoices || [];
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