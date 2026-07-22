import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { analyzeSermon } from '../services/claudeService';
import {
  saveEvaluation,
  getEvaluations,
  signInWithEmail,
  signUpWithEmail,
  signOut,
  getSession,
  onAuthStateChange,
} from '../services/supabaseService';

const GLOSSARY_TERM_MAP = {
  theological_fidelity: 'fidelity',
  exegetical_soundness: 'exegesis',
  gospel_centrality: 'gospel-centrality',
  relevancy: 'relevancy',
  clarity: 'clarity',
  connectivity: 'connectivity',
  precision: 'precision',
  call_to_action: 'call-to-action',
  relatability: 'relatability',
  pacing: 'pacing',
  enthusiasm: 'enthusiasm',
  charisma: 'charisma',
};

const EMPTY_SACRED_FOUNDATION = { theological_fidelity: false, exegetical_soundness: false, gospel_centrality: false };
const EMPTY_STRUCTURAL_WEIGHT = { relevancy: 0, clarity: 0, connectivity: 0, precision: 0, call_to_action: 0 };
const EMPTY_VOCAL_CADENCE = { relatability: 0, pacing: 0, enthusiasm: 0, charisma: 0 };
const EMPTY_POST_ANALYSIS = { anchoring_point: '', structural_drift: '', measurable_step: '' };

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // 'loading' | 'signedOut' | 'welcome' | 'signedIn'
  const [authStatus, setAuthStatus] = useState('loading');
  const [currentUser, setCurrentUser] = useState(null);
  const manualAuthInProgress = useRef(false);
  const isNewSignUp = useRef(false);

  const [savedEvaluations, setSavedEvaluations] = useState([]);
  const [glossaryTerm, setGlossaryTerm] = useState(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState('');
  const [analysisMilestone, setAnalysisMilestone] = useState('');
  const [recordedFile, setRecordedFile] = useState(null);

  const [sermonTitle, setSermonTitle] = useState('');
  const [preachDate, setPreachDate] = useState('');
  const [primaryGoal, setPrimaryGoal] = useState('');

  const [sacredFoundation, setSacredFoundation] = useState(EMPTY_SACRED_FOUNDATION);
  const [structuralWeight, setStructuralWeight] = useState(EMPTY_STRUCTURAL_WEIGHT);
  const [vocalCadence, setVocalCadence] = useState(EMPTY_VOCAL_CADENCE);
  const [evaluatorType, setEvaluatorType] = useState('human');
  const [evaluatorName, setEvaluatorName] = useState('');
  const [postAnalysis, setPostAnalysis] = useState(EMPTY_POST_ANALYSIS);

  const totalScore =
    Object.values(structuralWeight).reduce((a, b) => a + b, 0) +
    Object.values(vocalCadence).reduce((a, b) => a + b, 0);

  // ── Auth bootstrap ──
  useEffect(() => {
    let mounted = true;

    getSession()
      .then((session) => {
        if (!mounted) return;
        if (session?.user) {
          setCurrentUser(session.user);
          setAuthStatus('signedIn');
        } else {
          setAuthStatus('signedOut');
        }
      })
      .catch(() => {
        if (mounted) setAuthStatus('signedOut');
      });

    const { data: { subscription } } = onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (manualAuthInProgress.current) return;

      if (event === 'SIGNED_IN' && session?.user) {
        setCurrentUser(session.user);
        const createdAt = new Date(session.user.created_at).getTime();
        const isNewUser = Date.now() - createdAt < 60000;
        if (isNewUser) {
          isNewSignUp.current = true;
          setAuthStatus('welcome');
        } else {
          setAuthStatus('signedIn');
        }
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setAuthStatus('signedOut');
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const resetScorecard = useCallback(() => {
    setSermonTitle('');
    setPreachDate('');
    setPrimaryGoal('');
    setSacredFoundation(EMPTY_SACRED_FOUNDATION);
    setStructuralWeight(EMPTY_STRUCTURAL_WEIGHT);
    setVocalCadence(EMPTY_VOCAL_CADENCE);
    setPostAnalysis(EMPTY_POST_ANALYSIS);
    setRecordedFile(null);
    setEvaluatorType('human');
    setEvaluatorName('');
  }, []);

  const runAnalysis = useCallback(async (file) => {
    setIsAnalyzing(true);
    setAnalysisStatus('');
    setAnalysisMilestone('');

    let milestoneInterval = null;

    const statusHandler = (phase, message) => {
      setAnalysisStatus(message);

      const milestoneMap = {
        preflight: 'Verifying Supabase, Deepgram, and Claude connections...',
        upload: 'Securely uploading your file to temporary storage...',
        transcribe: 'Converting speech to text with Deepgram AI...',
        'transcribe-done': 'Transcript ready — preparing for Gamaliel...',
        analyze: 'Gamaliel is reading your sermon transcript...',
        done: 'Your scorecard has been filled in by Gamaliel.',
      };
      setAnalysisMilestone(milestoneMap[phase] || '');

      if (phase === 'analyze') {
        const milestones = [
          'Evaluating theological fidelity and exegetical soundness...',
          'Scoring structural weight: relevancy, clarity, connectivity...',
          'Assessing vocal cadence: pacing, enthusiasm, charisma...',
          'Identifying anchoring points and structural drift...',
          'Crafting your personalized improvement step...',
          'Almost done — finalizing your Homiletics Index...',
        ];
        let i = 0;
        milestoneInterval = setInterval(() => {
          if (i < milestones.length) {
            setAnalysisMilestone(milestones[i]);
            i++;
          }
        }, 5000);
      } else if (milestoneInterval && phase !== 'analyze') {
        clearInterval(milestoneInterval);
        milestoneInterval = null;
      }
    };

    try {
      const result = await analyzeSermon(
        file,
        { title: sermonTitle, goal: primaryGoal, date: preachDate },
        statusHandler
      );

      if (milestoneInterval) clearInterval(milestoneInterval);

      setAnalysisStatus('Processing results...');
      setAnalysisMilestone('Mapping scores to your scorecard...');
      await new Promise((r) => setTimeout(r, 500));

      const s = result.scores;
      setSacredFoundation({
        theological_fidelity: s.theologicalFidelity ?? false,
        exegetical_soundness: s.exegeticalSoundness ?? false,
        gospel_centrality: s.gospelCentrality ?? false,
      });
      setStructuralWeight({
        relevancy: s.relevancy ?? 0,
        clarity: s.clarity ?? 0,
        connectivity: s.connectivity ?? 0,
        precision: s.precision ?? 0,
        call_to_action: s.callToAction ?? 0,
      });
      setVocalCadence({
        relatability: s.relatability ?? 0,
        pacing: s.pacing ?? 0,
        enthusiasm: s.enthusiasm ?? 0,
        charisma: s.charisma ?? 0,
      });

      const analysis = result.fullAnalysis;
      const anchoringMatch = analysis.match(/### Anchoring Point[^\n]*\n([\s\S]*?)(?=###|$)/i);
      const driftMatch = analysis.match(/### Structural Drift[^\n]*\n([\s\S]*?)(?=###|$)/i);
      const stepMatch = analysis.match(/### Measurable Step[^\n]*\n([\s\S]*?)(?=###|$)/i);

      setPostAnalysis({
        anchoring_point: anchoringMatch ? anchoringMatch[1].trim() : '',
        structural_drift: driftMatch ? driftMatch[1].trim() : '',
        measurable_step: stepMatch ? stepMatch[1].trim() : '',
      });

      setEvaluatorType('ai');
      setEvaluatorName('Gamaliel');

      setAnalysisStatus('Analysis complete!');
      setAnalysisMilestone('Your scorecard has been filled in by Gamaliel.');
    } catch (error) {
      if (milestoneInterval) clearInterval(milestoneInterval);
      setAnalysisStatus(`Error: ${error.message}`);
      setAnalysisMilestone('Check the details above, fix the issue, and try again.');
      await new Promise((r) => setTimeout(r, 800));
      setIsAnalyzing(false);
      return;
    }

    await new Promise((r) => setTimeout(r, 800));
    setIsAnalyzing(false);
    setAnalysisStatus('');
    setAnalysisMilestone('');
  }, [sermonTitle, primaryGoal, preachDate]);

  const saveCurrentEvaluation = useCallback(async () => {
    const evaluator = { type: evaluatorType, name: evaluatorType === 'ai' ? 'Gamaliel' : evaluatorName };
    const evalData = {
      sermonTitle, preachDate, primaryGoal,
      sacredFoundation, structuralWeight, vocalCadence, postAnalysis,
      totalScore, evaluator,
    };

    try {
      await saveEvaluation(evalData);
    } catch (err) {
      console.warn('Supabase save skipped:', err.message);
    }

    setSavedEvaluations((prev) => [{
      total_score: totalScore,
      sermon_title: sermonTitle || 'Untitled Sermon',
      created_at: new Date().toISOString(),
      evaluator_type: evaluator.type,
      evaluator_name: evaluator.name,
      structural_weight: structuralWeight,
      vocal_cadence: vocalCadence,
    }, ...prev]);
  }, [sermonTitle, preachDate, primaryGoal, sacredFoundation, structuralWeight, vocalCadence, postAnalysis, totalScore, evaluatorType, evaluatorName]);

  const handleSave = useCallback(async () => {
    if (totalScore === 0 && !sermonTitle) return;
    await saveCurrentEvaluation();
    resetScorecard();
  }, [totalScore, sermonTitle, saveCurrentEvaluation, resetScorecard]);

  const loadEvaluations = useCallback(async () => {
    try {
      const data = await getEvaluations();
      setSavedEvaluations(data);
    } catch {
      console.warn('Could not load evaluations from Supabase.');
    }
  }, []);

  const navigateToGlossary = useCallback((termKey) => {
    setGlossaryTerm(termKey ? GLOSSARY_TERM_MAP[termKey] || null : null);
  }, []);

  const handleLogin = useCallback(async (email, password) => {
    manualAuthInProgress.current = true;
    try {
      const { session } = await signInWithEmail(email, password);
      if (session?.user) {
        setCurrentUser(session.user);
        setAuthStatus('signedIn');
      }
    } finally {
      setTimeout(() => { manualAuthInProgress.current = false; }, 1000);
    }
  }, []);

  const handleSignUp = useCallback(async (fullName, email, password) => {
    manualAuthInProgress.current = true;
    try {
      const { user, session } = await signUpWithEmail(email, password, fullName);
      setCurrentUser(session?.user || user);
      isNewSignUp.current = true;
      setAuthStatus('welcome');
    } finally {
      setTimeout(() => { manualAuthInProgress.current = false; }, 1000);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
    } catch (err) {
      console.warn('Sign out error:', err.message);
    }
    setCurrentUser(null);
    setAuthStatus('signedOut');
  }, []);

  const consumeIsNewSignUp = useCallback(() => {
    const was = isNewSignUp.current;
    isNewSignUp.current = false;
    return was;
  }, []);

  const value = useMemo(() => ({
    authStatus, setAuthStatus, currentUser,
    handleLogin, handleSignUp, handleLogout, consumeIsNewSignUp,

    savedEvaluations, loadEvaluations,
    glossaryTerm, navigateToGlossary,

    isAnalyzing, analysisStatus, analysisMilestone, recordedFile, setRecordedFile,
    runAnalysis,

    sermonTitle, setSermonTitle,
    preachDate, setPreachDate,
    primaryGoal, setPrimaryGoal,
    sacredFoundation, setSacredFoundation,
    structuralWeight, setStructuralWeight,
    vocalCadence, setVocalCadence,
    evaluatorType, setEvaluatorType,
    evaluatorName, setEvaluatorName,
    postAnalysis, setPostAnalysis,
    totalScore,

    saveCurrentEvaluation, handleSave, resetScorecard,
  }), [
    authStatus, currentUser, handleLogin, handleSignUp, handleLogout, consumeIsNewSignUp,
    savedEvaluations, loadEvaluations, glossaryTerm, navigateToGlossary,
    isAnalyzing, analysisStatus, analysisMilestone, recordedFile, runAnalysis,
    sermonTitle, preachDate, primaryGoal, sacredFoundation, structuralWeight, vocalCadence,
    evaluatorType, evaluatorName, postAnalysis, totalScore,
    saveCurrentEvaluation, handleSave, resetScorecard,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
