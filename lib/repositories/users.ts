import { getSupabase, hasSupabaseConfig } from '@/lib/supabase';
import type { Database } from '@/types/supabase';
import type { User as AppUser, LeaderboardEntry } from '@/lib/store';

type UsersRow = Database['public']['Tables']['users']['Row'];
type UsersInsert = Database['public']['Tables']['users']['Insert'];

function mapAppUserToRow(u: AppUser): UsersInsert {
  return {
    // We intentionally omit 'id' because our app's user id may not be a UUID
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

  // Best-effort upsert behavior without a unique constraint:
  // - Try to find an existing user by username; update if found, otherwise insert
  const { data: existing, error: findErr } = await supabase
    .from('users')
    .select('*')
    .eq('username', user.username)
    .limit(1);

  if (!findErr && existing && existing.length > 0) {
    const existingUser = existing[0] as UsersRow;
    const { error: updateErr } = await supabase
      .from('users')
      .update(row)
      .eq('id', existingUser.id);
    if (updateErr) {
      console.warn('Supabase update user error', updateErr);
      return false;
    }
    return true;
  }

  const { error } = await supabase.from('users').insert(row);
  if (error) {
    console.warn('Supabase insert user error', error);
    return false;
  }
  return true;
}

export async function getLeaderboardUsersRemote(): Promise<LeaderboardEntry[] | null> {
  if (!hasSupabaseConfig) return null;
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('winnings_amount', { ascending: false });
  if (error) {
    console.warn('Supabase fetch users error', error);
    return null;
  }
  const rows: UsersRow[] = (data ?? []) as UsersRow[];
  return rows.map((r) => ({
    id: r.id,
    username: r.username,
    avatar: r.avatar_url || 'https://i.pravatar.cc/150?img=1',
    score: Number(r.winnings_amount ?? 0),
  }));
}
