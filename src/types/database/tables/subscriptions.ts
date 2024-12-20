export interface SubscriptionsTable {
  Row: {
    id: string
    user_id: string
    stripe_customer_id: string | null
    stripe_subscription_id: string | null
    plan_type: string
    invoice_count: number | null
    status: string
    current_period_end: string | null
    created_at: string
    updated_at: string
  }
  Insert: {
    id?: string
    user_id: string
    stripe_customer_id?: string | null
    stripe_subscription_id?: string | null
    plan_type: string
    invoice_count?: number | null
    status: string
    current_period_end?: string | null
    created_at?: string
    updated_at?: string
  }
  Update: {
    id?: string
    user_id?: string
    stripe_customer_id?: string | null
    stripe_subscription_id?: string | null
    plan_type?: string
    invoice_count?: number | null
    status?: string
    current_period_end?: string | null
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