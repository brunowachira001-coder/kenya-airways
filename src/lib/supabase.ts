/**
 * Supabase client with localStorage fallback.
 *
 * If NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set,
 * a real Supabase client is created. Otherwise all DB operations fall back
 * to localStorage so the booking flow continues to work without backend credentials.
 *
 * To enable Supabase:
 *   1. Create a project at https://supabase.com
 *   2. Run supabase-setup.sql in the SQL Editor
 *   3. Copy .env.example → .env.local and fill in the two keys
 *   4. Restart the dev server
 *
 *   npm install @supabase/supabase-js   # (only needed when Supabase is configured)
 */

// Check if @supabase/supabase-js is available (installed separately by the user)
let _supabase: ReturnType<typeof createSupabaseClient> | null = null;

function createSupabaseClient() {
  // Dynamic import so the package is only resolved at runtime,
  // not during the Next.js build (where the package might not be installed yet)
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createClient } = require("@supabase/supabase-js");
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Only initialise when both env vars are present
if (
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0
) {
  try {
    _supabase = createSupabaseClient();
  } catch (err) {
    console.warn("[supabase] Failed to initialise Supabase client:", err);
    _supabase = null;
  }
}

/**
 * The Supabase client — null when credentials are not configured.
 * Components should check `if (supabase)` before making queries.
 */
export const supabase = _supabase;

/**
 * Helper: save a booking to localStorage (fallback when Supabase is unavailable).
 */
export function saveBookingLocally(booking: Record<string, unknown>): void {
  const key = `kq-booking-${Date.now()}`;
  localStorage.setItem(key, JSON.stringify(booking));
}

/**
 * Helper: retrieve all locally-stored bookings.
 */
export function getLocalBookings(): Record<string, unknown>[] {
  const bookings: Record<string, unknown>[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("kq-booking-")) {
      const item = localStorage.getItem(key);
      if (item) {
        try {
          bookings.push(JSON.parse(item));
        } catch {
          // ignore parse errors
        }
      }
    }
  }
  return bookings;
}

/** Returns true when a real Supabase client is configured and connected. */
export const isSupabaseConfigured = supabase !== null;