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

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
  'https://qlfrpvziqadddcflygfy.supabase.co';
const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsZnJwdnppcWFkZGRjZmx5Z2Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4MTY4MTgsImV4cCI6MjEwNzM5MjgxOH0.2TDReJQ7qtKNj-smoFUFs_5mVs0G63FLoQiMCEM-YjE';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

let supabase: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  supabase = createClient(supabaseUrl!, supabaseAnonKey!);
}

export { supabase };
