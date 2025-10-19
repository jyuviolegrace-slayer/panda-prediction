import { db } from '@/lib/db';
import { predictions, type NewPredictionRow, type PredictionRow } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSupabase, hasSupabaseConfig } from '@/lib/supabase';
import type { Prediction, Comment as AppComment } from '@/lib/store';

function mapRowToApp(row: PredictionRow): Prediction {
  const parsedComments = typeof row.comments === 'string' ? safeParse(row.comments, []) : (row.comments ?? []);
  const parsedOptions = typeof row.options === 'string' ? safeParse(row.options, []) : (row.options ?? []);
  const parsedAuthor = typeof row.author === 'string' ? safeParse(row.author, { username: '', avatar: '', twitter: '' }) : row.author;
  const parsedTopVoters = typeof row.topVoters === 'string' ? safeParse(row.topVoters, []) : (row.topVoters ?? []);
  return {
    id: row.id,
    title: row.title,
    thumbnail: row.thumbnail ?? null,
    votes: row.votes ?? 0,
    pool: row.pool ?? 0,
    comments: parsedComments as AppComment[],
    options: parsedOptions as any,
    duration: row.duration,
    createdAt: row.createdAt,
    author: parsedAuthor as any,
    topVoters: parsedTopVoters as { avatar: string }[],
  } as Prediction;
}

function safeParse<T>(val: string, fallback: T): T {
  try {
    return JSON.parse(val) as T;
  } catch {
    return fallback;
  }
}

function mapAppToRow(p: Prediction): NewPredictionRow {
  return {
    id: p.id,
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
  } satisfies NewPredictionRow;
}

export function getAllPredictionsLocal(): Prediction[] {
  const data = db.select().from(predictions).orderBy(predictions.createdAt).all() as PredictionRow[];
  // Newest first
  return data.sort((a: PredictionRow, b: PredictionRow) => b.createdAt - a.createdAt).map(mapRowToApp);
}

export function upsertPredictionsLocal(items: Prediction[]) {
  const rows = items.map(mapAppToRow);
  for (const r of rows) {
    // try update then insert if missing
    const existing = db.select().from(predictions).where(eq(predictions.id, r.id)).all();
    if (existing.length) {
      db.update(predictions).set(r).where(eq(predictions.id, r.id)).run();
    } else {
      db.insert(predictions).values(r).run();
    }
  }
}

export function insertPredictionLocal(item: Prediction) {
  const row = mapAppToRow(item);
  db.insert(predictions).values(row).run();
}

export function updatePredictionVoteLocal(predictionId: string, optionId: string, amount: number) {
  const rows = db.select().from(predictions).where(eq(predictions.id, predictionId)).all();
  if (!rows.length) return;
  const p = mapRowToApp(rows[0]);
  const opts = p.options.map(o => (o.id === optionId ? { ...o, votes: o.votes + 1 } : o));
  const updated: Prediction = {
    ...p,
    votes: p.votes + 1,
    pool: Math.round((p.pool + amount) * 100) / 100,
    options: opts,
  };
  db.update(predictions).set(mapAppToRow(updated)).where(eq(predictions.id, predictionId)).run();
}

export function addCommentLocal(predictionId: string, comment: AppComment) {
  const rows = db.select().from(predictions).where(eq(predictions.id, predictionId)).all();
  if (!rows.length) return;
  const p = mapRowToApp(rows[0]);
  const updated: Prediction = { ...p, comments: [comment, ...p.comments] };
  db.update(predictions).set(mapAppToRow(updated)).where(eq(predictions.id, predictionId)).run();
}

// Remote (Supabase)
export async function getAllPredictionsRemote(): Promise<Prediction[] | null> {
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
  return rows.map(r => {
    const createdAt = typeof r.createdAt === 'number' ? r.createdAt : (r.created_at ? Date.parse(r.created_at) : Date.now());
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
      author: typeof r.author === 'string' ? safeParse(r.author, { username: '', avatar: '', twitter: '' }) : r.author,
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
