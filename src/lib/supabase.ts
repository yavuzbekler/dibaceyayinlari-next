import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function getSupabase() {
  if (!supabaseUrl || !anonKey) {
    throw new Error("Supabase public environment variables are missing.");
  }

  return createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false }
  });
}

export function getSupabaseAdmin() {
  if (!supabaseUrl || !serviceKey) {
    throw new Error("Supabase service environment variables are missing.");
  }

  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false }
  });
}
