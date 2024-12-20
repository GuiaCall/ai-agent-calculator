import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database/schema';

// Provide default values for development
const supabaseUrl = 'https://qqyfupdnjcvecvdgvzct.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxeWZ1cGRuamN2ZWN2ZGd2emN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg5NjQ4MDAsImV4cCI6MjAyNDU0MDgwMH0.qDPZqWz2GqPq-QHHXNFkAh1FMB-DPwvjHxbwqGG7_vY';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);