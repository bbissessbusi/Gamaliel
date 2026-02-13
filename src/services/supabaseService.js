import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Exposed for direct REST uploads (XHR with progress tracking)
export { supabaseUrl, supabaseAnonKey };

// ============================================================================
// AUTHENTICATION
// ============================================================================

/** Sign up with email + password. Returns { user, session } on success. */
export async function signUpWithEmail(email, password, fullName) {
  if (!supabase) throw new Error('Supabase not configured.');

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  });

  if (error) throw error;

  // Supabase returns a user with empty identities (and no error) when the
  // email already exists — this prevents email enumeration. Detect it and
  // give the user a clear message.
  if (data.user && data.user.identities?.length === 0) {
    throw new Error('An account with this email already exists. Try logging in instead.');
  }

  if (!data.user) {
    throw new Error('Sign up failed — no user was returned. Please try again.');
  }

  return data;
}

/** Sign in with email + password. Returns the session on success. */
export async function signInWithEmail(email, password) {
  if (!supabase) throw new Error('Supabase not configured.');

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/** Sign in (or sign up) with Google or Apple. Redirects the browser. */
export async function signInWithOAuth(provider) {
  if (!supabase) throw new Error('Supabase not configured.');

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider, // 'google' or 'apple'
    options: {
      redirectTo: window.location.origin,
    },
  });

  if (error) throw error;
  return data;
}

/** Sign out the current user. */
export async function signOut() {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/** Get the current session (returns null if not logged in). */
export async function getSession() {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/** Listen for auth state changes (login, logout, token refresh). */
export function onAuthStateChange(callback) {
  if (!supabase) return { data: { subscription: { unsubscribe: () => {} } } };
  return supabase.auth.onAuthStateChange(callback);
}

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
