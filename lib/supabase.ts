import 'react-native-url-polyfill/auto';

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import * as ImagePicker from 'expo-image-picker';

// function getEnv(name: string): string | undefined {
//   // Support multiple common env names to be flexible
//   const candidates = [
//     name,
//     `EXPO_PUBLIC_${name}`,
//     name.replace('REACT_NATIVE_', ''),
//     `EXPO_PUBLIC_${name.replace('REACT_NATIVE_', '')}`,
//   ];
//   for (const key of candidates) {
//     // @ts-ignore - process.env is injected by Expo for EXPO_PUBLIC_*
//     const val = process.env?.[key];
//     if (val) return val as string;
//   }
//   return undefined;
// }

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY; //getEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY') || getEnv('SUPABASE_ANON_KEY');

export const hasSupabaseConfig = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

let client: SupabaseClient<Database> | null = null;

export function getSupabase(): SupabaseClient<Database> | null {
  if (!hasSupabaseConfig) return null;
  if (!client) {
    client = createClient<Database>(SUPABASE_URL as string, SUPABASE_ANON_KEY as string, {
      auth: {
        // No auth required for MVP; enable session later when Auth is added
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }
  return client;
}

// Media upload helpers (Supabase Storage)
export async function pickAndUploadImage(
  bucket: string,
  pathPrefix: string
): Promise<string | null> {
  const supabase = getSupabase();
  // Always allow picking, even if Supabase is not configured
  const result = await ImagePicker.launchImageLibraryAsync({
    // Expo SDK 54 / expo-image-picker@15 expects an array of media types
    // Using 'as any' keeps compatibility across minor API changes
    mediaTypes: ['images'] as any,
    quality: 0.8,
  } as any);
  if (result.canceled) return null;
  const asset = result.assets[0];

  if (!supabase) {
    // Fallback: return local URI so the UI can still preview
    return asset.uri;
  }

  const fileExt = asset.fileName?.split('.').pop() || asset.uri.split('.').pop() || 'jpg';
  const path = `${pathPrefix}/${Date.now()}.${fileExt}`;
  const res = await fetch(asset.uri);
  const blob = await res.blob();
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, blob, { upsert: true, contentType: blob.type || 'image/jpeg' });
  if (error) {
    console.warn('Supabase upload error', error);
    return null;
  }
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl ?? null;
}

export async function uploadImageFromUri(
  bucket: string,
  pathPrefix: string,
  uri: string
): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) return uri;
  const fileExt = uri.split('.').pop() || 'jpg';
  const path = `${pathPrefix}/${Date.now()}.${fileExt}`;
  const res = await fetch(uri);
  const blob = await res.blob();
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, blob, { upsert: true, contentType: blob.type || 'image/jpeg' });
  if (error) {
    console.warn('Supabase upload error', error);
    return null;
  }
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl ?? null;
}
