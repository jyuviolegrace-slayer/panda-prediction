import { getSupabase, hasSupabaseConfig } from '@/lib/supabase';
import type { Prediction } from '@/lib/store';
import type { Database, Json } from '@/types/supabase';

type PredictionsRow = Database['public']['Tables']['predictions']['Row'];
type PredictionsInsert = Database['public']['Tables']['predictions']['Insert'];

function safeParse<T>(val: string, fallback: T): T {
  try {
    return JSON.parse(val) as T;
  } catch {
    return fallback;
  }
}

function fromJsonOr<T>(val: Json | null, fallback: T): T {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'string') return safeParse(val, fallback);
  return val as unknown as T;
}

function mapAppToRow(p: Prediction): PredictionsInsert {
  return {
    title: p.title,
    thumbnail: p.thumbnail ?? null,
    votes: p.votes,
    pool: p.pool,
    comments: (p.comments ?? []) as unknown as Json,
    options: (p.options ?? []) as unknown as Json,
    duration: p.duration,
    created_at: p.createdAt,
    author: (p.author ?? null) as unknown as Json,
    top_voters: (p.topVoters ?? []) as unknown as Json,
  };
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
  const rows: PredictionsRow[] = (data ?? []) as PredictionsRow[];
  return rows.map((r) => {
    const createdAtIso = r.created_at;
    return {
      id: r.id,
      title: r.title,
      thumbnail: r.thumbnail ?? null,
      votes: r.votes ?? 0,
      pool: r.pool ?? 0,
      comments: fromJsonOr(r.comments, [] as Prediction['comments']),
      options: fromJsonOr(r.options, [] as Prediction['options']),
      duration: r.duration,
      createdAt: createdAtIso,
      author: fromJsonOr(r.author, { username: '', avatar: '', twitter: '' } as Prediction['author']),
      topVoters: fromJsonOr(r.top_voters, [] as Prediction['topVoters']),
    } satisfies Prediction;
  });
}

export async function insertPredictionRemote(item: Prediction): Promise<boolean> {
  if (!hasSupabaseConfig) return false;
  const supabase = getSupabase();
  if (!supabase) return false;
  const { error } = await supabase.from('predictions').insert(mapAppToRow(item));
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
  const { error } = await supabase.from('predictions').upsert(mapAppToRow(item));
  if (error) {
    console.warn('Supabase upsert error', error);
    return false;
  }
  return true;
}
