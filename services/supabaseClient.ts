import { createClient, SupabaseClient } from '@supabase/supabase-js';

// NOTE: In a real environment, these would be populated from process.env
// For this demo build, we will check if they exist, otherwise we return null
// and the service layer will handle the "Demo Mode" fallback.

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConfigured = (): boolean => {
  return !!supabase;
};