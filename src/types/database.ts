export interface Invoice {
  id: string;
  user_id: string;
  invoice_number: string;
  total_amount: number;
  tax_rate: number;
  margin: number;
  total_minutes: number;
  call_duration: number;
  client_info: Record<string, any>;
  agency_info: Record<string, any>;
  created_at: string;
  updated_at: string;
  invoice_parameters?: InvoiceParameter[];
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

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: string;
  invoice_limit: number;
  invoices_generated: number;
  status: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  current_period_end?: string;
  created_at: string;
  updated_at: string;
}