import { db } from '@/lib/db';
import { predictions, type NewPredictionRow, type PredictionRow } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSupabase, hasSupabaseConfig } from '@/lib/supabase';
import type { Prediction, Comment as AppComment } from '@/lib/store';

function mapRowToApp(row: PredictionRow): Prediction {
  return {
    id: row.id,
    title: row.title,
    thumbnail: row.thumbnail ?? null,
    votes: row.votes ?? 0,
    pool: row.pool ?? 0,
    comments: (row.comments ?? []) as AppComment[],
    options: row.options ?? [],
    duration: row.duration,
    createdAt: row.createdAt,
    author: row.author,
    topVoters: (row.topVoters ?? []) as { avatar: string }[],
  } as Prediction;
}

function mapAppToRow(p: Prediction): NewPredictionRow {
  return {
    id: p.id,
    title: p.title,
    thumbnail: p.thumbnail ?? null,
    votes: p.votes,
    pool: p.pool,
    comments: p.comments as any,
    options: p.options as any,
    duration: p.duration,
    createdAt: p.createdAt,
    author: p.author as any,
    topVoters: p.topVoters as any,
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
  return (data as any as Prediction[]) ?? null;
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
