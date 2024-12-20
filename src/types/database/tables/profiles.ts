export interface ProfilesTable {
  Row: {
    id: string
    name: string | null
    location: string | null
    bio: string | null
    avatar_url: string | null
    created_at: string
    updated_at: string
  }
  Insert: {
    id: string
    name?: string | null
    location?: string | null
    bio?: string | null
    avatar_url?: string | null
    created_at?: string
    updated_at?: string
  }
  Update: {
    id?: string
    name?: string | null
    location?: string | null
    bio?: string | null
    avatar_url?: string | null
    created_at?: string
    updated_at?: string
  }
  Relationships: [
    {
      foreignKeyName: "profiles_id_fkey"
      columns: ["id"]
      isOneToOne: true
      referencedRelation: "users"
      referencedColumns: ["id"]
    }
  ]
}