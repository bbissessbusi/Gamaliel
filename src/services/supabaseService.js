import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ============================================================================
// EVALUATIONS TABLE OPERATIONS
// ============================================================================

export async function saveEvaluation(data) {
  if (!supabase) throw new Error('Supabase not configured. Add credentials to .env');

  const { data: result, error } = await supabase
    .from('evaluations')
    .insert([{
      sermon_title: data.sermonTitle,
      preach_date: data.preachDate || null,
      primary_goal: data.primaryGoal,
      total_score: data.totalScore,
      sacred_foundation: data.sacredFoundation,
      structural_weight: data.structuralWeight,
      vocal_cadence: data.vocalCadence,
      post_analysis: data.postAnalysis,
      evaluator_type: data.evaluator.type,
      evaluator_name: data.evaluator.name,
    }])
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function getEvaluations() {
  if (!supabase) throw new Error('Supabase not configured. Add credentials to .env');

  const { data, error } = await supabase
    .from('evaluations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getEvaluationById(id) {
  if (!supabase) throw new Error('Supabase not configured. Add credentials to .env');

  const { data, error } = await supabase
    .from('evaluations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function deleteEvaluation(id) {
  if (!supabase) throw new Error('Supabase not configured. Add credentials to .env');

  const { error } = await supabase
    .from('evaluations')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
