export interface ContactPerson {
  name: string;
  phone: string;
}

export interface ClientInfo {
  name: string;
  address: string;
  tvaNumber: string;
  contactPerson: ContactPerson;
  [key: string]: any;
}

export interface AgencyInfo {
  name: string;
  phone: string;
  address: string;
  email: string;
  website: string;
  [key: string]: any;
}

export interface InvoiceHistory {
  id: string;
  invoice_number: string;
  created_at: string;
  client_info: ClientInfo;
  agency_info: AgencyInfo;
  total_amount: number;
  tax_rate: number;
  margin: number;
  setup_cost: number;
  monthly_service_cost: number;
  total_minutes: number;
  call_duration: number;
  user_id: string;
}