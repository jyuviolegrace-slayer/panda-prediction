import { getSupabase, hasSupabaseConfig } from '@/lib/supabase';
import type { Database } from '@/types/supabase';
import type { User as AppUser } from '@/lib/store';

type UsersInsert = Database['public']['Tables']['users']['Insert'];

function mapAppUserToRow(u: AppUser): UsersInsert {
  return {
    id: u.id,
    username: u.username,
    twitter_handle: u.twitter || null,
    avatar_url: u.avatar || null,
    banner_url: null,
    votes_count: u.stats?.votes ?? 0,
    accuracy_percentage: u.stats?.accuracy ?? 0,
    winnings_amount: u.stats?.winnings ?? 0,
    updated_at: new Date().toISOString(),
  };
}

export async function upsertUserRemote(user: AppUser): Promise<boolean> {
  if (!hasSupabaseConfig) return false;
  const supabase = getSupabase();
  if (!supabase) return false;
  const row = mapAppUserToRow(user);
  const { error } = await supabase.from('users').upsert(row, { onConflict: 'id' });
  if (error) {
    console.warn('Supabase upsert user error', error);
    return false;
  }
  return true;
}
