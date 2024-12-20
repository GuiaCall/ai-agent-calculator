import { Json } from "./database";

export interface InvoiceHistory {
  id: string;
  invoice_number: string;
  total_amount: number;
  tax_rate: number;
  margin: number;
  total_minutes: number;
  call_duration: number;
  client_info: ClientInfo;
  agency_info: AgencyInfo;
  created_at: string;
  technologies: Technology[];
}

export interface ClientInfo {
  name: string;
  address: string;
  tvaNumber: string;
  contactPerson: {
    name: string;
    phone: string;
  };
}

export interface AgencyInfo {
  name: string;
  phone: string;
  address: string;
  email: string;
  website: string;
}

export interface Technology {
  id: string;
  name: string;
  isSelected: boolean;
  costPerMinute: number;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: string;
  status: string;
  invoice_count: number;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}