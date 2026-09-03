import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Supabase client, shared by server and browser code.
//
// The anon key is deliberately public: it identifies the project, it does not
// authorise anything. Row Level Security is what protects the data, which is why
// the policies in supabase/schema.sql are the thing to get right, not the key's
// secrecy.
//
// The service_role key is NOT used here and must never be. It bypasses every
// policy, so it stays in SUPABASE_SERVICE_ROLE_KEY, server-side, unreferenced by
// application code.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** False when the project is not configured, so callers can fall back to local data. */
export function hasSupabase(): boolean {
  return Boolean(url && anonKey);
}

let cached: SupabaseClient | null = null;

/**
 * Returns the client, or null when Supabase is not configured. Null rather than
 * throwing: a missing environment variable should degrade the app to its local
 * catalogue, not take the site down.
 */
export function getSupabase(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  if (!cached) {
    cached = createClient(url, anonKey, {
      auth: { persistSession: false },
      global: {
        // Next caches fetches in server components indefinitely by default, which
        // would pin the catalogue to whatever it looked like at build time.
        // A short revalidate keeps pages statically generatable at build --
        // `no-store` makes them dynamic and silently falls back to lib/data.ts --
        // while still picking up a title added through /api/titles within a minute.
        fetch: (input, init) => fetch(input, { ...init, next: { revalidate: 30 } }),
      },
    });
  }
  return cached;
}
