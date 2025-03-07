
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qqyfupdnjcvecvdgvzct.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxeWZ1cGRuamN2ZWN2ZGd2emN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzMDQ2NzcsImV4cCI6MjA0OTg4MDY3N30.cc9HzmbW9ujXAwsPWODRCFfoZDxklnTePS26CR-9_kc";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'sb-auth-token',
      detectSessionInUrl: true
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
    global: {
      headers: {
        'x-application-name': 'agent-calculator',
      },
    },
  }
);

// Subscribe to subscription changes
export const subscribeToSubscriptionChanges = (userId: string, callback: () => void) => {
  return supabase
    .channel('subscription_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'subscriptions',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        console.log('Subscription change detected:', payload);
        callback();
      }
    )
    .subscribe();
};

// Add debug function to help with troubleshooting
export const logSupabaseResponse = (operation: string, error: any, data: any) => {
  if (error) {
    console.error(`Supabase ${operation} error:`, error);
    return false;
  }
  
  console.log(`Supabase ${operation} successful:`, data);
  return true;
};
