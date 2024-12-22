export interface ContactPerson {
  name: string;
  phone: string;
}

export interface ClientInfo {
  name: string;
  address: string;
  tvaNumber: string;
  contactPerson: ContactPerson;
}

export interface AgencyInfo {
  name: string;
  phone: string;
  address: string;
  email: string;
  website: string;
}

export interface InvoiceHistory {
  id: string;
  invoiceNumber: string;
  date: Date;
  clientInfo: ClientInfo;
  agencyInfo: AgencyInfo;
  totalAmount: number;
  taxRate: number;
  margin: number;
  totalMinutes: number;
  callDuration: number;
}

export interface DatabaseInvoice {
  id: string;
  user_id: string;
  invoice_number: string;
  total_amount: number;
  tax_rate: number;
  margin: number;
  total_minutes: number;
  call_duration: number;
  client_info: ClientInfo;
  agency_info: AgencyInfo;
  date: string;
  created_at: string;
  updated_at: string;
}