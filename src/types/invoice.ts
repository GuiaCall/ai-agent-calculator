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

export interface InvoiceParameter {
  id: string;
  invoice_id: string;
  technology_name: string;
  cost_per_minute: number;
  is_selected: boolean;
  created_at: string;
  updated_at: string;
}

export interface InvoiceHistory {
  id: string;
  invoice_number: string;
  date: Date;
  total_amount: number;
  tax_rate: number;
  margin: number;
  total_minutes: number;
  call_duration: number;
  client_info: ClientInfo;
  agency_info: AgencyInfo;
  created_at: string;
  updated_at: string;
  invoice_parameters?: InvoiceParameter[];
}