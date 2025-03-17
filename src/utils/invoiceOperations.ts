
import { supabase } from "@/integrations/supabase/client";
import { AgencyInfo, ClientInfo, InvoiceHistory } from "@/types/invoice";
import { safelyParseJSON } from "@/utils/jsonUtils";

/**
 * Creates a new invoice in the database
 */
export async function createInvoice(
  userId: string,
  agencyInfo: AgencyInfo,
  clientInfo: ClientInfo,
  setupCost: number,
  monthlyCost: number,
  taxRate: number,
  margin: number,
  totalMinutes: number,
  callDuration: number
) {
  const currentYear = 2025;
  const { data: existingInvoices } = await supabase
    .from('invoices')
    .select('invoice_number')
    .ilike('invoice_number', `INV-${currentYear}-%`);
  
  let nextSequence = 1;
  
  if (existingInvoices && existingInvoices.length > 0) {
    const sequences = existingInvoices.map(inv => {
      const seqStr = inv.invoice_number.split('-')[2];
      return parseInt(seqStr, 10);
    });
    nextSequence = Math.max(...sequences) + 1;
  }
  
  const invoiceNumber = `INV-${currentYear}-${nextSequence.toString().padStart(6, '0')}`;
  
  const newInvoice = {
    user_id: userId,
    agency_info: agencyInfo,
    client_info: clientInfo,
    setup_cost: setupCost,
    total_amount: monthlyCost,
    tax_rate: taxRate,
    margin: margin,
    total_minutes: totalMinutes,
    call_duration: callDuration,
    invoice_number: invoiceNumber,
    monthly_service_cost: monthlyCost
  };
  
  return await supabase
    .from('invoices')
    .insert(newInvoice)
    .select();
}

/**
 * Updates an existing invoice in the database
 */
export async function updateInvoice(
  invoiceId: string,
  agencyInfo: AgencyInfo,
  clientInfo: ClientInfo,
  setupCost: number,
  monthlyCost: number,
  taxRate: number,
  margin: number,
  totalMinutes: number,
  callDuration: number
) {
  return await supabase
    .from('invoices')
    .update({
      agency_info: agencyInfo,
      client_info: clientInfo,
      setup_cost: setupCost,
      total_amount: monthlyCost,
      tax_rate: taxRate,
      margin: margin,
      total_minutes: totalMinutes,
      call_duration: callDuration,
      monthly_service_cost: monthlyCost,
      updated_at: new Date().toISOString()
    })
    .eq('id', invoiceId);
}

/**
 * Formats invoice data for the UI
 */
export function formatInvoiceData(invoiceData: any): InvoiceHistory {
  // Create default values for ClientInfo and AgencyInfo
  const defaultClientInfo: ClientInfo = {
    name: "",
    address: "",
    tvaNumber: "",
    contactPerson: {
      name: "",
      phone: ""
    }
  };
  
  const defaultAgencyInfo: AgencyInfo = {
    name: "",
    phone: "",
    address: "",
    email: "",
    website: ""
  };
  
  return {
    ...invoiceData,
    agency_info: safelyParseJSON<AgencyInfo>(invoiceData.agency_info, defaultAgencyInfo),
    client_info: safelyParseJSON<ClientInfo>(invoiceData.client_info, defaultClientInfo)
  } as InvoiceHistory;
}
