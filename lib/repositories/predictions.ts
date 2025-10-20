import { getSupabase, hasSupabaseConfig } from '@/lib/supabase';
import type { Prediction } from '@/lib/store';

function safeParse<T>(val: string, fallback: T): T {
  try {
    return JSON.parse(val) as T;
  } catch {
    return fallback;
  }
}

function mapAppToRow(p: Prediction) {
  return {
    // id: p.id,
    title: p.title,
    thumbnail: p.thumbnail ?? null,
    votes: p.votes,
    pool: p.pool,
    comments: JSON.stringify(p.comments ?? []),
    options: JSON.stringify(p.options ?? []),
    duration: p.duration,
    createdAt: p.createdAt,
    author: JSON.stringify(p.author ?? null),
    topVoters: JSON.stringify(p.topVoters ?? []),
  } as const;
}

// Remote (Supabase)
export async function getAllPredictionsRemote(): Promise<Prediction[] | null> {
  console.log('getAllPredictionsRemote Supabase config', hasSupabaseConfig);
  if (!hasSupabaseConfig) return null;
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('predictions')
    .select('*')
    .order('createdAt', { ascending: false });
  if (error) {
    console.warn('Supabase fetch error', error);
    return null;
  }
  const rows = (data as any[]) || [];
  return rows.map((r) => {
    const createdAt =
      typeof r.createdAt === 'number'
        ? r.createdAt
        : r.created_at
          ? Date.parse(r.created_at)
          : Date.now();
    return {
      id: r.id,
      title: r.title,
      thumbnail: r.thumbnail ?? null,
      votes: r.votes ?? 0,
      pool: r.pool ?? 0,
      comments: typeof r.comments === 'string' ? safeParse(r.comments, []) : (r.comments ?? []),
      options: typeof r.options === 'string' ? safeParse(r.options, []) : (r.options ?? []),
      duration: r.duration,
      createdAt,
      author:
        typeof r.author === 'string'
          ? safeParse(r.author, { username: '', avatar: '', twitter: '' })
          : r.author,
      topVoters: typeof r.topVoters === 'string' ? safeParse(r.topVoters, []) : (r.topVoters ?? []),
    } as Prediction;
  });
}

export async function insertPredictionRemote(item: Prediction): Promise<boolean> {
  if (!hasSupabaseConfig) return false;
  const supabase = getSupabase();
  if (!supabase) return false;
  const { error } = await supabase.from('predictions').insert(mapAppToRow(item) as any);
  if (error) {
    console.warn('Supabase insert error', error);
    return false;
  }
  return true;
}

export async function upsertPredictionRemote(item: Prediction): Promise<boolean> {
  if (!hasSupabaseConfig) return false;
  const supabase = getSupabase();
  if (!supabase) return false;
  const { error } = await supabase.from('predictions').upsert(mapAppToRow(item) as any);
  if (error) {
    console.warn('Supabase upsert error', error);
    return false;
  }
  return true;
}
