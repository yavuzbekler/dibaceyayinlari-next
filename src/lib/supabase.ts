import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const noStoreFetch: typeof fetch = (input, init = {}) =>
  fetch(input, { ...init, cache: "no-store" });

let _supabase: SupabaseClient | null = null;
let _supabaseAdmin: SupabaseClient | null = null;

export function getSupabase() {
  if (_supabase) return _supabase;
  if (!supabaseUrl || !anonKey) {
    throw new Error("Supabase public environment variables are missing.");
  }
  _supabase = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false },
    global: { fetch: noStoreFetch }
  });
  return _supabase;
}

export function getSupabaseAdmin() {
  if (_supabaseAdmin) return _supabaseAdmin;
  if (!supabaseUrl || !serviceKey) {
    throw new Error("Supabase service environment variables are missing.");
  }
  _supabaseAdmin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
    global: { fetch: noStoreFetch }
  });
  return _supabaseAdmin;
}
