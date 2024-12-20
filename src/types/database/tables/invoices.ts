export interface InvoicesTable {
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
    date: string
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
    date?: string
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
    date?: string
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