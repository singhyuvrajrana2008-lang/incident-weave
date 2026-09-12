import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
export const isSupabaseConfigured = Boolean(url && key);
export const supabase = createClient(url || "https://placeholder.supabase.co", key || "placeholder-anon-key", { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
export function requireSupabase() { if (!isSupabaseConfigured) throw new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."); return supabase; }
