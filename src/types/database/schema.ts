export interface Database {
  public: {
    Tables: {
      personal_records: {
        Row: {
          id: string;
          user_id: string;
          distance: number;
          time: unknown;
          race_location: string;
          date_achieved: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          distance: number;
          time: unknown;
          race_location: string;
          date_achieved: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          distance?: number;
          time?: unknown;
          race_location?: string;
          date_achieved?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          name: string | null;
          location: string | null;
          bio: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string | null;
          location?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          location?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          plan_type: string;
          invoice_count: number | null;
          invoice_limit: number;
          invoices_generated: number;
          status: string;
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          plan_type: string;
          invoice_count?: number | null;
          invoice_limit?: number;
          invoices_generated?: number;
          status: string;
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          plan_type?: string;
          invoice_count?: number | null;
          invoice_limit?: number;
          invoices_generated?: number;
          status?: string;
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      invoices: {
        Row: {
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
        };
        Insert: {
          id?: string;
          user_id: string;
          invoice_number: string;
          total_amount: number;
          tax_rate: number;
          margin: number;
          total_minutes: number;
          call_duration: number;
          client_info: Record<string, any>;
          agency_info: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          invoice_number?: string;
          total_amount?: number;
          tax_rate?: number;
          margin?: number;
          total_minutes?: number;
          call_duration?: number;
          client_info?: Record<string, any>;
          agency_info?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
      };
      invoice_parameters: {
        Row: {
          id: string;
          invoice_id: string;
          technology_name: string;
          cost_per_minute: number;
          is_selected: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          technology_name: string;
          cost_per_minute: number;
          is_selected?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          invoice_id?: string;
          technology_name?: string;
          cost_per_minute?: number;
          is_selected?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}