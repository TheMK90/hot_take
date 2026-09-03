import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// The service-role client. It bypasses every RLS policy, so it is import-guarded
// with "server-only" and must never be reached from a client component.
//
// There is exactly one legitimate use for it here: adding a title to the
// catalogue when someone reviews a film we do not hold. The `titles_admin_write`
// policy deliberately refuses anonymous inserts — otherwise anyone holding the
// public anon key could write rows into the catalogue — so the server performs
// that write on the user's behalf, after validating the title against TMDb.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let cached: SupabaseClient | null = null;

/** Null when unconfigured, so callers degrade instead of throwing. */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!url || !serviceKey) return null;
  if (!cached) {
    cached = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}
