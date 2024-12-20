import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database/schema';

const supabaseUrl = 'https://qqyfupdnjcvecvdgvzct.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxeWZ1cGRuamN2ZWN2ZGd2emN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg0NTQ0NzcsImV4cCI6MjAyNDAzMDQ3N30.Wd0VbPtTm1hj7d5spqtGpSbHgVqOFOc-kpxDQX_oK_o';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});