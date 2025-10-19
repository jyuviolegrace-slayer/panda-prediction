import 'react-native-url-polyfill/auto';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

function getEnv(name: string): string | undefined {
  // Support multiple common env names to be flexible
  const candidates = [
    name,
    `EXPO_PUBLIC_${name}`,
    name.replace('REACT_NATIVE_', ''),
    `EXPO_PUBLIC_${name.replace('REACT_NATIVE_', '')}`,
  ];
  for (const key of candidates) {
    // @ts-ignore - process.env is injected by Expo for EXPO_PUBLIC_*
    const val = process.env?.[key];
    if (val) return val as string;
  }
  return undefined;
}

const SUPABASE_URL =
  getEnv('YOUR_REACT_NATIVE_SUPABASE_URL') ||
  getEnv('REACT_NATIVE_SUPABASE_URL') ||
  getEnv('SUPABASE_URL');
const SUPABASE_ANON_KEY =
  getEnv('REACT_NATIVE_SUPABASE_ANON_KEY') ||
  getEnv('SUPABASE_ANON_KEY');

export const hasSupabaseConfig = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!hasSupabaseConfig) return null;
  if (!client) {
    client = createClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }
  return client;
}
