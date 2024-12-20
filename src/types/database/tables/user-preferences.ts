export interface UserPreferencesTable {
  Row: {
    id: string
    user_id: string
    theme_color: string | null
    invoice_preview_color: string | null
    client_info_color: string | null
    invoice_details_color: string | null
    total_color: string | null
    created_at: string | null
    updated_at: string | null
  }
  Insert: {
    id?: string
    user_id: string
    theme_color?: string | null
    invoice_preview_color?: string | null
    client_info_color?: string | null
    invoice_details_color?: string | null
    total_color?: string | null
    created_at?: string | null
    updated_at?: string | null
  }
  Update: {
    id?: string
    user_id?: string
    theme_color?: string | null
    invoice_preview_color?: string | null
    client_info_color?: string | null
    invoice_details_color?: string | null
    total_color?: string | null
    created_at?: string | null
    updated_at?: string | null
  }
  Relationships: [
    {
      foreignKeyName: "user_preferences_user_id_fkey"
      columns: ["user_id"]
      isOneToOne: false
      referencedRelation: "users"
      referencedColumns: ["id"]
    }
  ]
}