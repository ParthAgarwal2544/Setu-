import { createClient } from "@supabase/supabase-js";

// Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to be set
// in .env.local — see .env.local.example. Both are safe to expose to the browser;
// the anon key only grants what your Supabase Row Level Security policies allow.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  // Non-fatal: lets the app still boot for local UI work even before Supabase
  // credentials are wired in, but auth calls will fail until they are.
  console.warn(
    "[Setu] Supabase env vars are missing. Copy .env.local.example to .env.local " +
    "and fill in your Supabase project's URL and anon key."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

