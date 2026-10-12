// ═══════════════════════════════════════════════════════
// Supabase client configuration
// ═══════════════════════════════════════════════════════
//
// Required environment variables (create a .env file):
//   VITE_SUPABASE_URL=https://your-project.supabase.co
//   VITE_SUPABASE_ANON_KEY=your-anon-key
//
// These are safe to use in client-side code.
// NEVER use the service-role key in frontend code.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

let supabase: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  supabase = createClient(supabaseUrl!, supabaseAnonKey!);
}

export { supabase };
