import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database/schema';

// Provide default values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qqyfupdnjcvecvdgvzct.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxeWZ1cGRuamN2ZWN2ZGd2emN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg5NjQ4MDAsImV4cCI6MjAyNDU0MDgwMH0.qDPZqWz2GqPq-QHHXNFkAh1FMB-DPwvjHxbwqGG7_vY';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are missing, using default values');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);