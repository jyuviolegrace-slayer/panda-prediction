import { getSupabase, hasSupabaseConfig } from '@/lib/supabase';

export async function insertVoteRemote(args: {
  predictionId: string;
  userId: string;
  optionIndex: number;
  amount: number;
}): Promise<boolean> {
  if (!hasSupabaseConfig) return false;
  const supabase = getSupabase();
  if (!supabase) return false;
  const { error } = await supabase.from('votes').insert({
    prediction_id: args.predictionId,
    user_id: args.userId,
    option_selected: args.optionIndex,
    amount: args.amount,
  } as any);
  if (error) {
    console.warn('Supabase insert vote error', error);
    return false;
  }
  return true;
}
