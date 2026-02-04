import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const KEY = "__lunara_supabase__";

export const supabase =
  globalThis[KEY] ??
  (globalThis[KEY] = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storageKey: "lunara-auth",
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }));



