export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      invoices: {
        Row: {
          agency_info: Json
          call_duration: number
          client_info: Json
          created_at: string | null
          date: string | null
          id: string
          invoice_number: string
          is_deleted: boolean | null
          last_exported_at: string | null
          margin: number
          monthly_service_cost: number
          setup_cost: number
          tax_rate: number
          total_amount: number
          total_minutes: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          agency_info: Json
          call_duration: number
          client_info: Json
          created_at?: string | null
          date?: string | null
          id?: string
          invoice_number: string
          is_deleted?: boolean | null
          last_exported_at?: string | null
          margin: number
          monthly_service_cost?: number
          setup_cost?: number
          tax_rate: number
          total_amount: number
          total_minutes: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          agency_info?: Json
          call_duration?: number
          client_info?: Json
          created_at?: string | null
          date?: string | null
          id?: string
          invoice_number?: string
          is_deleted?: boolean | null
          last_exported_at?: string | null
          margin?: number
          monthly_service_cost?: number
          setup_cost?: number
          tax_rate?: number
          total_amount?: number
          total_minutes?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      personal_records: {
        Row: {
          created_at: string
          date_achieved: string
          distance: number
          id: string
          race_location: string
          time: unknown
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date_achieved: string
          distance: number
          id?: string
          race_location: string
          time: unknown
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date_achieved?: string
          distance?: number
          id?: string
          race_location?: string
          time?: unknown
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          id: string
          location: string | null
          name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id: string
          location?: string | null
          name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          location?: string | null
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_consent: {
        Row: {
          consent_date: string | null
          cookie_consent: boolean | null
          gdpr_consent: boolean | null
          id: string
          last_updated: string | null
          legal_disclaimer_acknowledged: boolean | null
          user_id: string
        }
        Insert: {
          consent_date?: string | null
          cookie_consent?: boolean | null
          gdpr_consent?: boolean | null
          id?: string
          last_updated?: string | null
          legal_disclaimer_acknowledged?: boolean | null
          user_id: string
        }
        Update: {
          consent_date?: string | null
          cookie_consent?: boolean | null
          gdpr_consent?: boolean | null
          id?: string
          last_updated?: string | null
          legal_disclaimer_acknowledged?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          client_info_color: string | null
          created_at: string | null
          id: string
          invoice_details_color: string | null
          invoice_preview_color: string | null
          theme_color: string | null
          total_color: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          client_info_color?: string | null
          created_at?: string | null
          id?: string
          invoice_details_color?: string | null
          invoice_preview_color?: string | null
          theme_color?: string | null
          total_color?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          client_info_color?: string | null
          created_at?: string | null
          id?: string
          invoice_details_color?: string | null
          invoice_preview_color?: string | null
          theme_color?: string | null
          total_color?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
