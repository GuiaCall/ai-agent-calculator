export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
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
          client_info: Json;
          agency_info: Json;
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
          client_info: Json;
          agency_info: Json;
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
      };
    };
  };
}