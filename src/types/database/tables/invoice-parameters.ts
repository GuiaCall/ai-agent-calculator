export interface InvoiceParametersTable {
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