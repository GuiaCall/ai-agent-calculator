import { InvoicesTable } from './tables/invoices';
import { InvoiceParametersTable } from './tables/invoice-parameters';
import { ProfilesTable } from './tables/profiles';
import { SubscriptionsTable } from './tables/subscriptions';
import { UserPreferencesTable } from './tables/user-preferences';

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
      invoices: InvoicesTable
      invoice_parameters: InvoiceParametersTable
      profiles: ProfilesTable
      subscriptions: SubscriptionsTable
      user_preferences: UserPreferencesTable
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