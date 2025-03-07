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
    },
  }
);