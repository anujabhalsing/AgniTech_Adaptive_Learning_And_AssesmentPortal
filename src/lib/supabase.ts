/**
 * Supabase client — gracefully no-ops when credentials are absent.
 * All features that need Supabase check `isSupabaseConfigured()` before calling.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url  = import.meta.env.VITE_SUPABASE_URL  as string | undefined;
const key  = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = (): boolean =>
  Boolean(url && key && url !== 'https://your-project.supabase.co');

// Lazily created so tree-shaking keeps the bundle lean if unconfigured
let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_client) {
    if (!isSupabaseConfigured()) {
      throw new Error(
        'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
      );
    }
    _client = createClient(url!, key!);
  }
  return _client;
}

// Safe wrapper — returns null instead of throwing when unconfigured
export function tryGetSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  return getSupabase();
}
