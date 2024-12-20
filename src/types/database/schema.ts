export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      invoices: {
        Row: {
          id: string
          user_id: string
          invoice_number: string
          total_amount: number
          tax_rate: number
          margin: number
          total_minutes: number
          call_duration: number
          client_info: Json
          agency_info: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          invoice_number: string
          total_amount: number
          tax_rate: number
          margin: number
          total_minutes: number
          call_duration: number
          client_info: Json
          agency_info: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          invoice_number?: string
          total_amount?: number
          tax_rate?: number
          margin?: number
          total_minutes?: number
          call_duration?: number
          client_info?: Json
          agency_info?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      invoice_parameters: {
        Row: {
          id: string
          invoice_id: string
          technology_name: string
          cost_per_minute: number
          is_selected: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          invoice_id: string
          technology_name: string
          cost_per_minute: number
          is_selected?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          invoice_id?: string
          technology_name?: string
          cost_per_minute?: number
          is_selected?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_parameters_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          }
        ]
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_type: string
          status: string
          invoice_limit: number
          invoices_generated: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_type?: string
          status?: string
          invoice_limit?: number
          invoices_generated?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_type?: string
          status?: string
          invoice_limit?: number
          invoices_generated?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}