import React, { useState, useEffect, useRef } from 'react';
import GlossaryPage from './GlossaryPage';
import EvaluationHistoryPage from './EvaluationHistoryPage';
import EvaluationSummaryPage from './EvaluationSummaryPage';
import GuidedTourPage from './GuidedTourPage';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import Logo from './components/Logo';
import { analyzeSermon } from './services/claudeService';
import {
  saveEvaluation,
  getEvaluations,
  signInWithEmail,
  signUpWithEmail,
  signInWithOAuth,
  signOut,
  getSession,
  onAuthStateChange,
} from './services/supabaseService';

// ============================================================================
// GLOSSARY TERM MAPPING (dashboard key → glossary card ID)
// ============================================================================

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

// ============================================================================
// MOCK DATA & UTILITIES
// ============================================================================

// Color interpolation function for sliders
const getSliderColor = (value) => {
  const r = Math.round(255 - (value * (255 - 139) / 10));
  const g = Math.round(69 - (value * 69 / 10));
  const b = Math.round(0 + (value * 139 / 10));
  return `rgb(${r}, ${g}, ${b})`;
};

// ============================================================================
// SHARED COMPONENTS
// ============================================================================

// Glass Card Component with jump hover effect
const GlassCard = ({ children, className = '', isCircle = false, noHover = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.025)',
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        borderRadius: isCircle ? '50%' : '60px',
        transform: (!noHover && isHovered) ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: (!noHover && isHovered)
          ? '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 69, 0, 0.15)'
          : '0 4px 12px rgba(0, 0, 0, 0.2)',
        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient border */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: isCircle ? '50%' : '60px',
          padding: '1px',
          background: 'linear-gradient(135deg, #FF4500, #D12D6F, #8B008B)',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          opacity: 0.5
        }}
      />
      {/* Top specular highlight */}
      <div
        className="absolute top-0 left-[10%] right-[10%] h-[1px] pointer-events-none z-10"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.1), transparent)'
        }}
      />
      {/* Left edge specular highlight */}
      <div
        className="absolute top-[5%] left-0 bottom-[30%] w-[1px] pointer-events-none z-10"
        style={{
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.3), transparent)'
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// Gradient Button with debossing effect
const GradientButton = ({ children, onClick, className = '', small = false, disabled = false }) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      disabled={disabled}
      className={`relative overflow-hidden text-white font-black uppercase ${className}`}
      style={{
        padding: small ? '8px 16px' : '16px 32px',
        fontSize: small ? '8px' : '12px',
        letterSpacing: '0.3em',
        background: isPressed
          ? 'linear-gradient(90deg, #CC3700 0%, #6B006B 100%)'
          : 'linear-gradient(90deg, #FF4500 0%, #8B008B 100%)',
        boxShadow: isPressed
          ? 'inset 0 4px 8px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(255, 69, 0, 0.2)'
          : '0 10px 30px -10px rgba(255, 69, 0, 0.5), 0 4px 12px rgba(0, 0, 0, 0.2)',
        borderRadius: small ? '20px' : '32px',
        transform: isPressed ? 'scale(0.96)' : 'scale(1)',
        transition: 'transform 0.1s ease, box-shadow 0.1s ease, background 0.1s ease',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <div
        className="absolute top-0 left-[10%] right-[10%] h-[1px] pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.2), transparent)'
        }}
      />
      {children}
    </button>
  );
};

// Logo imported from shared component

// ============================================================================
// DASHBOARD COMPONENTS
// ============================================================================

const SpectrumSlider = ({ label, value, onChange, onLabelClick }) => {
  const color = getSliderColor(value);
  const percentage = (value / 10) * 100;

  return (
    <div className="mb-4">
      <div className="flex justify-between items-end mb-2">
        <label className="font-bold text-[10px] uppercase tracking-[0.2em] text-white">
          {onLabelClick ? (
            <span
              onClick={(e) => { e.preventDefault(); onLabelClick(); }}
              className="cursor-pointer hover:text-[#FF4500] transition-colors border-b border-transparent hover:border-[#FF4500]/50"
            >
              {label}
            </span>
          ) : label}
        </label>
        <span
          className="text-[10px] font-black font-mono transition-colors"
          style={{ color, filter: `drop-shadow(0 0 8px ${color})` }}
        >
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="10"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-1.5 appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${color} ${percentage}%, rgba(255, 255, 255, 0.1) ${percentage}%)`,
          borderRadius: '9999px',
          '--thumb-color': color
        }}
      />
    </div>
  );
};

const CheckboxItem = ({ label, subtitle, checked, onToggle, onLabelClick }) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <div
      className={`relative flex-shrink-0 w-6 h-6 border flex items-center justify-center transition-all ${checked ? 'border-transparent bg-transparent' : 'border-white/20 bg-black/40 group-hover:border-orange-500/50'}`}
      style={{ borderRadius: '8px' }}
      onClick={onToggle}
    >
      {checked && <span className="text-xl">✅</span>}
    </div>
    <div className="flex flex-col">
      <span className="font-bold text-white text-xs tracking-tight uppercase">
        {onLabelClick ? (
          <span
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onLabelClick(); }}
            className="cursor-pointer hover:text-[#FF4500] transition-colors border-b border-transparent hover:border-[#FF4500]/50"
          >
            {label}
          </span>
        ) : label}
      </span>
      <span className="text-[10px] sm:text-[8px] text-white/70 uppercase font-bold tracking-widest">{subtitle}</span>
    </div>
  </label>
);

const PillContainer = ({ children, className = '', onClick }) => (
  <div
    className={`bg-white/5 border border-white/5 ${className}`}
    style={{ borderRadius: '20px' }}
    onClick={onClick}
  >
    {children}
  </div>
);

const SectionHeader = ({ number, emoji, title }) => (
  <div className="flex items-center gap-3 mb-4">
    {number && <span className="font-black text-lg italic">{number}</span>}
    {emoji && <span className="text-lg">{emoji}</span>}
    <h3
      className="text-sm font-black uppercase tracking-widest italic"
      style={{
        background: 'linear-gradient(90deg, #FF4500 0%, #D12D6F 50%, #8B008B 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}
    >
      {title}
    </h3>
  </div>
);

const InputField = ({ label, emoji, type = 'text', placeholder, value, onChange }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[8px] font-black text-white tracking-[0.3em] uppercase flex items-center gap-1">
      <span>{emoji}</span> {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="bg-white/5 border border-white/10 text-white placeholder:text-white/40 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-orange-500/50 [color-scheme:dark]"
      style={{
        borderRadius: '16px',
        padding: '10px 14px',
      }}
    />
  </div>
);

const AIPulse = () => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setScale(s => s === 1 ? 1.2 : 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="w-2 h-2 bg-[#39ff14] transition-transform duration-1000"
      style={{
        borderRadius: '50%',
        transform: `scale(${scale})`,
        boxShadow: '0 0 15px rgba(57, 255, 20, 0.6)'
      }}
    />
  );
};

// ============================================================================
// WELCOME BACK PAGE (shown to returning users after login)
// ============================================================================

const WelcomeBackPage = ({ onContinue }) => {
  useEffect(() => {
    const timer = setTimeout(() => onContinue(), 10000);
    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-white px-6"
      style={{
        fontFamily: "'Space Grotesk', sans-serif",
        background: `radial-gradient(circle at 30% 20%, rgba(255, 69, 0, 0.15) 0%, transparent 40%),
                     radial-gradient(circle at 70% 80%, rgba(139, 0, 139, 0.2) 0%, transparent 40%),
                     #050203`,
      }}
    >
      <Logo height={56} showLabel={false} />
      <h1
        className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight mt-8 mb-3 text-center"
        style={{
          background: 'linear-gradient(90deg, #FF4500 0%, #D12D6F 50%, #8B008B 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Welcome Back
      </h1>
      <p className="text-white/50 text-sm font-light text-center max-w-sm">
        Your scorecard is ready. Let's continue refining your craft.
      </p>
      <div className="mt-8 w-8 h-8 border-2 border-[#FF4500] border-t-transparent rounded-full animate-spin opacity-40" />
      <p className="mt-6 text-[9px] text-white/25 uppercase tracking-[0.3em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        Loading your data...
      </p>
    </div>
  );
};

// ============================================================================
// MAIN APP WITH PAGE NAVIGATION
// ============================================================================

export default function GamalielApp() {
  const [currentPage, setCurrentPage] = useState('loading'); // 'loading' | 'login' | 'signup' | 'dashboard' | 'summary' | 'glossary' | 'history' | 'tour' | 'welcome-back'
  const [currentUser, setCurrentUser] = useState(null);
  const [glossaryTerm, setGlossaryTerm] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState('');
  const [analysisMilestone, setAnalysisMilestone] = useState('');
  const [recordedFile, setRecordedFile] = useState(null);
  const [savedEvaluations, setSavedEvaluations] = useState([]);
  const fileInputRef = useRef(null);

  // Guard: when handleLogin / handleSignUp are actively navigating,
  // the onAuthStateChange listener should not override their navigation.
  const manualAuthInProgress = useRef(false);

  // Track whether the current session started from a fresh signup,
  // so we can route: welcome-back → tour → dashboard (instead of → dashboard).
  const isNewSignUp = useRef(false);

  // ── Auth: check session on mount + listen for auth state changes ──
  useEffect(() => {
    let mounted = true;

    // Check for existing session (keeps users logged in across refreshes)
    getSession().then((session) => {
      if (!mounted) return;
      if (session?.user) {
        setCurrentUser(session.user);
        // Already logged in — go straight to the scorecard
        setCurrentPage('dashboard');
      } else {
        setCurrentPage('login');
      }
    }).catch(() => {
      if (mounted) setCurrentPage('login');
    });

    // Listen for auth events (handles OAuth redirect callbacks, email
    // verification returns, sign-out, etc.)
    const { data: { subscription } } = onAuthStateChange((event, session) => {
      if (!mounted) return;

      // Skip if a manual login/signup handler is already navigating
      if (manualAuthInProgress.current) return;

      if (event === 'SIGNED_IN' && session?.user) {
        setCurrentUser(session.user);

        // Determine if this is a brand-new user (created within the last 60 seconds)
        const createdAt = new Date(session.user.created_at).getTime();
        const now = Date.now();
        const isNewUser = (now - createdAt) < 60000;

        if (isNewUser) {
          // New user (e.g. just verified email or OAuth first-time) → welcome → tour
          isNewSignUp.current = true;
          setCurrentPage('welcome-back');
        } else {
          // Returning user → straight to scorecard
          setCurrentPage('dashboard');
        }
        window.scrollTo(0, 0);
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setCurrentPage('login');
        window.scrollTo(0, 0);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Form state
  const [sermonTitle, setSermonTitle] = useState('');
  const [preachDate, setPreachDate] = useState('');
  const [primaryGoal, setPrimaryGoal] = useState('');
  const [mediaType, setMediaType] = useState('voice');
  const [recordingStatus, setRecordingStatus] = useState('ready');
  const [recordingDuration, setRecordingDuration] = useState(0);

  // Sacred Foundation
  const [sacredFoundation, setSacredFoundation] = useState({
    theological_fidelity: false,
    exegetical_soundness: false,
    gospel_centrality: false,
  });

  // Structural Weight (Section 2) - 5 criteria
  const [structuralWeight, setStructuralWeight] = useState({
    relevancy: 0,
    clarity: 0,
    connectivity: 0,
    precision: 0,
    call_to_action: 0,
  });

  // Vocal Cadence (Section 3) - 4 criteria
  const [vocalCadence, setVocalCadence] = useState({
    relatability: 0,
    pacing: 0,
    enthusiasm: 0,
    charisma: 0,
  });

  // Evaluator Signature
  const [evaluatorType, setEvaluatorType] = useState('human'); // 'human' | 'ai'
  const [evaluatorName, setEvaluatorName] = useState('');

  // Post Analysis
  const [postAnalysis, setPostAnalysis] = useState({
    anchoring_point: '',
    structural_drift: '',
    measurable_step: '',
  });

  // Calculate total score
  const totalScore = Object.values(structuralWeight).reduce((a, b) => a + b, 0) +
    Object.values(vocalCadence).reduce((a, b) => a + b, 0);

  // Gamaliel AI Analysis — Upload → Transcribe (Deepgram) → Analyze (Claude)
  const runAnalysis = async (file) => {
    setIsAnalyzing(true);
    setAnalysisMilestone('');

    // Milestone ticker for the Claude analysis phase
    let milestoneInterval = null;

    const statusHandler = (phase, message) => {
      setAnalysisStatus(message);

      const milestoneMap = {
        'upload': 'Securely uploading your file to temporary storage...',
        'transcribe': 'Converting speech to text with Deepgram AI...',
        'transcribe-done': 'Transcript ready — preparing for Gamaliel...',
        'analyze': 'Gamaliel is reading your sermon transcript...',
        'done': 'Your scorecard has been filled in by Gamaliel.',
      };
      setAnalysisMilestone(milestoneMap[phase] || '');

      // Start milestone ticker during Claude analysis
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
      const result = await analyzeSermon(file, {
        title: sermonTitle,
        goal: primaryGoal,
        date: preachDate,
      }, statusHandler);

      if (milestoneInterval) clearInterval(milestoneInterval);

      setAnalysisStatus('Processing results...');
      setAnalysisMilestone('Mapping scores to your scorecard...');
      await new Promise(r => setTimeout(r, 500));

      // Apply parsed scores from Claude's response
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

      // Extract post-analysis sections from the full analysis text
      const analysis = result.fullAnalysis;
      const anchoringMatch = analysis.match(/### Anchoring Point[^\n]*\n([\s\S]*?)(?=###|$)/i);
      const driftMatch = analysis.match(/### Structural Drift[^\n]*\n([\s\S]*?)(?=###|$)/i);
      const stepMatch = analysis.match(/### Measurable Step[^\n]*\n([\s\S]*?)(?=###|$)/i);

      setPostAnalysis({
        anchoring_point: anchoringMatch ? anchoringMatch[1].trim() : '',
        structural_drift: driftMatch ? driftMatch[1].trim() : '',
        measurable_step: stepMatch ? stepMatch[1].trim() : '',
      });

      // Auto-set evaluator to AI Gamaliel
      setEvaluatorType('ai');
      setEvaluatorName('Gamaliel');

      setAnalysisStatus('Analysis complete!');
      setAnalysisMilestone('Your scorecard has been filled in by Gamaliel.');
    } catch (error) {
      if (milestoneInterval) clearInterval(milestoneInterval);
      setAnalysisStatus(`Error: ${error.message}`);
      setAnalysisMilestone('');
      await new Promise(r => setTimeout(r, 6000));
    }

    await new Promise(r => setTimeout(r, 800));
    setIsAnalyzing(false);
    setAnalysisStatus('');
    setAnalysisMilestone('');
  };

  // Trigger file picker when AI Assistant button is clicked
  const handleGamalielAnalysis = () => {
    if (recordedFile) {
      runAnalysis(recordedFile);
    } else {
      fileInputRef.current?.click();
    }
  };

  // Handle file selection for sermon upload
  const handleFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setRecordedFile(file);
      runAnalysis(file);
    }
  };

  // Save evaluation to Supabase + local state
  const saveCurrentEvaluation = async () => {
    const evaluator = { type: evaluatorType, name: evaluatorType === 'ai' ? 'Gamaliel' : evaluatorName };
    const evalData = {
      sermonTitle, preachDate, primaryGoal,
      sacredFoundation, structuralWeight, vocalCadence, postAnalysis,
      totalScore, evaluator,
    };

    // Save to Supabase
    try {
      await saveEvaluation(evalData);
    } catch (err) {
      console.warn('Supabase save skipped:', err.message);
    }

    // Always save to local state for history page
    setSavedEvaluations(prev => [{
      total_score: totalScore,
      sermon_title: sermonTitle || 'Untitled Sermon',
      created_at: new Date().toISOString(),
      evaluator_type: evaluator.type,
      evaluator_name: evaluator.name,
      structural_weight: structuralWeight,
      vocal_cadence: vocalCadence,
    }, ...prev]);
  };

  // Handle Calculate Score - saves and navigates to summary
  const handleCalculateScore = async () => {
    await saveCurrentEvaluation();
    setCurrentPage('summary');
    window.scrollTo(0, 0);
  };

  // Handle Save button - saves and clears the scorecard
  const handleSave = async () => {
    if (totalScore === 0 && !sermonTitle) return;
    await saveCurrentEvaluation();
    resetScorecard();
  };

  // Reset scorecard fields to blank
  const resetScorecard = () => {
    setSermonTitle('');
    setPreachDate('');
    setPrimaryGoal('');
    setSacredFoundation({ theological_fidelity: false, exegetical_soundness: false, gospel_centrality: false });
    setStructuralWeight({ relevancy: 0, clarity: 0, connectivity: 0, precision: 0, call_to_action: 0 });
    setVocalCadence({ relatability: 0, pacing: 0, enthusiasm: 0, charisma: 0 });
    setPostAnalysis({ anchoring_point: '', structural_drift: '', measurable_step: '' });
    setRecordingStatus('ready');
    setRecordedFile(null);
    setEvaluatorType('human');
    setEvaluatorName('');
  };

  // Reset and return to dashboard
  const handleNewEvaluation = () => {
    resetScorecard();
    setCurrentPage('dashboard');
    window.scrollTo(0, 0);
  };

  // Load evaluations from Supabase for history page
  const loadEvaluations = async () => {
    try {
      const data = await getEvaluations();
      setSavedEvaluations(data);
    } catch {
      console.warn('Could not load evaluations from Supabase. Using mock data.');
    }
  };

  // Navigate to glossary, optionally scrolling to a specific term
  const navigateToGlossary = (termKey) => {
    setGlossaryTerm(termKey ? GLOSSARY_TERM_MAP[termKey] || null : null);
    setCurrentPage('glossary');
  };

  // Navigate home — if logged in go to dashboard, otherwise login
  const navigateHome = () => {
    setCurrentPage(currentUser ? 'dashboard' : 'login');
    window.scrollTo(0, 0);
  };

  // ── Auth handlers (real Supabase auth) ──

  const handleLogin = async (email, password) => {
    manualAuthInProgress.current = true;
    try {
      const { session } = await signInWithEmail(email, password);
      if (session?.user) {
        setCurrentUser(session.user);
        // Returning users go straight to the scorecard — no waiting
        setCurrentPage('dashboard');
        window.scrollTo(0, 0);
      }
    } finally {
      // Release the guard after a short delay so the onAuthStateChange
      // listener doesn't immediately override the page we just set.
      setTimeout(() => { manualAuthInProgress.current = false; }, 1000);
    }
  };

  const handleSignUp = async (fullName, email, password) => {
    manualAuthInProgress.current = true;
    try {
      // signUpWithEmail throws on error (caught by SignUpPage's try/catch)
      const { user, session } = await signUpWithEmail(email, password, fullName);

      // Save the email so the login form is pre-filled next time (Remember Me)
      localStorage.setItem('gamaliel_remembered_email', email);

      // Set user (session may be null if email confirmation is required —
      // the user will confirm via the email Supabase sends automatically).
      setCurrentUser(session?.user || user);

      // Mark as new signup so welcome-back routes to tour next
      isNewSignUp.current = true;
      setCurrentPage('welcome-back');
      window.scrollTo(0, 0);
    } finally {
      setTimeout(() => { manualAuthInProgress.current = false; }, 1000);
    }
  };

  // OAuth handler — works for both login and signup (Google / Apple)
  // This redirects the browser to the provider. When the user returns,
  // onAuthStateChange fires SIGNED_IN and handles navigation automatically.
  const handleOAuthLogin = async (provider) => {
    await signInWithOAuth(provider);
    // Browser will redirect to Google/Apple — no code runs after this point.
  };

  // Logout — clears session and returns to login
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.warn('Sign out error:', err.message);
    }
    setCurrentUser(null);
    setCurrentPage('login');
    window.scrollTo(0, 0);
  };

  // ============================================================================
  // RENDER DASHBOARD PAGE
  // ============================================================================

  const renderDashboard = () => (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#070304]/80 backdrop-blur-2xl safe-top">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Logo height={28} onClick={navigateHome} />
          <nav className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar">
            <button
              onClick={() => { setCurrentPage('tour'); }}
              className="text-[10px] sm:text-[11px] font-black tracking-[0.2em] text-white/50 hover:text-[#FF4500] transition-colors uppercase whitespace-nowrap py-2"
            >
              TOUR
            </button>
            <button
              onClick={() => { loadEvaluations(); setCurrentPage('history'); }}
              className="text-[10px] sm:text-[11px] font-black tracking-[0.2em] text-white/50 hover:text-[#FF4500] transition-colors uppercase whitespace-nowrap py-2"
            >
              HISTORY
            </button>
            <button
              onClick={() => navigateToGlossary()}
              className="text-[10px] sm:text-[11px] font-black tracking-[0.2em] text-white/50 hover:text-[#FF4500] transition-colors uppercase whitespace-nowrap py-2"
            >
              LEXICON
            </button>
            <GradientButton small onClick={handleSave}>SAVE</GradientButton>
            <button
              onClick={handleLogout}
              className="text-[10px] sm:text-[11px] font-black tracking-[0.2em] text-white/50 hover:text-red-400 transition-colors uppercase whitespace-nowrap py-2"
            >
              LOGOUT
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tighter uppercase mb-3">
            <span style={{
              background: 'linear-gradient(90deg, #FF4500 0%, #D12D6F 50%, #8B008B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>SCORECARD</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)' }} className="text-sm font-light leading-relaxed max-w-md">
            Premium digital analysis of sermon weight, structure, and delivery. Designed for intentional preachers.
          </p>
        </section>

        {/* Sermon Info Card */}
        <GlassCard className="mb-6">
          <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField label="Sermon Title/Text" emoji="📖" placeholder="e.g. Romans 8:1-4" value={sermonTitle} onChange={(e) => setSermonTitle(e.target.value)} />
            <InputField label="Preach Date" emoji="📅" type="date" value={preachDate} onChange={(e) => setPreachDate(e.target.value)} />
            <InputField label="Primary Goal" emoji="🎯" placeholder="The core objective" value={primaryGoal} onChange={(e) => setPrimaryGoal(e.target.value)} />
          </div>
        </GlassCard>

        {/* Digital Capture Section */}
        <section className="mb-6">
          <SectionHeader emoji="📹" title="Digital Capture" />
          <GlassCard>
            <div className="px-8 py-6">
              <div className="flex flex-col gap-4">
                <div>
                  <h4 className="text-sm font-bold tracking-tight uppercase" style={{
                    background: 'linear-gradient(90deg, #FF4500 0%, #D12D6F 50%, #8B008B 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  }}>Sermon Recording</h4>
                  <p style={{ color: 'rgba(255,255,255,0.7)' }} className="text-[10px] leading-relaxed mt-1">
                    Record your sermon (max 60 min). Gamaliel AI will transcribe and analyze automatically.
                  </p>
                </div>

                {/* Hidden file input for sermon upload */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*,video/*,.mp3,.mp4,.m4a,.m4v,.aac,.ogg,.oga,.opus,.flac,.wav,.wma,.amr,.webm,.mov,.avi,.mkv,.caf,.aiff,.aif,.3gp,.3gpp,.mpga,.mpeg,.wmv"
                  onChange={handleFileSelected}
                  className="hidden"
                />

                {/* Upload status indicator */}
                {recordedFile && !isAnalyzing && (
                  <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center justify-between">
                    <span className="text-[9px] font-mono text-white/60">
                      📁 {recordedFile.name}
                    </span>
                    <button
                      onClick={() => {
                        setRecordedFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="ml-3 w-5 h-5 flex items-center justify-center rounded-full bg-white/10 hover:bg-red-500/30 text-white/50 hover:text-red-400 transition-all text-xs leading-none"
                      title="Remove file"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Analysis Status with Milestones */}
                {isAnalyzing && (
                  <div className="bg-[#39ff14]/10 border border-[#39ff14]/30 rounded-xl px-4 py-3 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 border-2 border-[#39ff14] border-t-transparent rounded-full animate-spin" />
                      <span className="text-[10px] font-mono text-[#39ff14] font-bold">{analysisStatus}</span>
                    </div>
                    {analysisMilestone && (
                      <p className="text-[9px] font-mono text-white/50 pl-7 leading-relaxed italic">
                        {analysisMilestone}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  {/* AI Assistant Button */}
                  <PillContainer
                    className="flex items-center gap-3 px-4 py-2.5 hover:border-[#39ff14]/30 transition-all cursor-pointer flex-1 min-w-[200px]"
                    onClick={handleGamalielAnalysis}
                  >
                    <div className="flex flex-col flex-1">
                      <span className="text-[7px] font-mono font-bold text-[#39ff14] uppercase tracking-[0.2em]">🤖 Gamaliel AI Assistant</span>
                      <span className="text-white text-[9px] font-mono font-bold uppercase tracking-widest mt-0.5">
                        {isAnalyzing ? 'Analyzing...' : 'Start AI Analysis'}
                      </span>
                    </div>
                    <AIPulse />
                  </PillContainer>

                  {/* Recording Controls */}
                  <div className="flex items-center gap-3">
                    <PillContainer className="flex items-center gap-2 px-3 py-2.5">
                      <button onClick={() => setMediaType('voice')} className={`flex items-center gap-1 transition-colors ${mediaType === 'voice' ? 'text-[#FF4500]' : 'text-white/60 hover:text-white'}`}>
                        <span className="text-sm">🎙️</span>
                        <span className="text-[8px] font-bold uppercase tracking-wider">Voice</span>
                      </button>
                      <div className="w-px h-4 bg-white/10" />
                      <button onClick={() => setMediaType('video')} className={`flex items-center gap-1 transition-colors ${mediaType === 'video' ? 'text-[#FF4500]' : 'text-white/60 hover:text-white'}`}>
                        <span className="text-sm">📹</span>
                        <span className="text-[8px] font-bold uppercase tracking-wider">Video</span>
                      </button>
                    </PillContainer>

                    <button
                      onClick={() => setRecordingStatus(recordingStatus === 'ready' ? 'recording' : 'ready')}
                      className="w-9 h-9 border-2 border-orange-500/30 flex items-center justify-center transition-all duration-100"
                      style={{
                        borderRadius: '50%',
                        transform: recordingStatus === 'recording' ? 'scale(0.95)' : 'scale(1)',
                        boxShadow: recordingStatus === 'recording' ? 'inset 0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(255, 69, 0, 0.2)'
                      }}
                    >
                      <div className="bg-[#FF4500]" style={{
                        width: recordingStatus === 'recording' ? '10px' : '16px',
                        height: recordingStatus === 'recording' ? '10px' : '16px',
                        borderRadius: recordingStatus === 'recording' ? '2px' : '50%',
                        boxShadow: '0 0 12px #FF4500'
                      }} />
                    </button>
                    <span className="text-[8px] text-white uppercase font-black tracking-[0.3em]">
                      {recordingStatus === 'recording' ? 'REC' : 'Ready'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Section 1: Sacred Foundation */}
        <section className="mb-6">
          <SectionHeader number="1️⃣" title="Sacred Foundation" />
          <GlassCard>
            <div className="px-8 py-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <CheckboxItem label="Theological Fidelity" subtitle="Doctrinal accuracy" checked={sacredFoundation.theological_fidelity} onToggle={() => setSacredFoundation(p => ({...p, theological_fidelity: !p.theological_fidelity}))} onLabelClick={() => navigateToGlossary('theological_fidelity')} />
              <CheckboxItem label="Exegetical Soundness" subtitle="Contextual integrity" checked={sacredFoundation.exegetical_soundness} onToggle={() => setSacredFoundation(p => ({...p, exegetical_soundness: !p.exegetical_soundness}))} onLabelClick={() => navigateToGlossary('exegetical_soundness')} />
              <CheckboxItem label="Gospel Centrality" subtitle="Christ-focused" checked={sacredFoundation.gospel_centrality} onToggle={() => setSacredFoundation(p => ({...p, gospel_centrality: !p.gospel_centrality}))} onLabelClick={() => navigateToGlossary('gospel_centrality')} />
            </div>
          </GlassCard>
        </section>

        {/* Sections 2 & 3 Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <section className="min-w-0">
            <SectionHeader number="2️⃣" title="Structural Weight" />
            <GlassCard>
              <div className="px-8 py-6">
                <SpectrumSlider label="Relevancy" value={structuralWeight.relevancy} onChange={(v) => setStructuralWeight(p => ({...p, relevancy: v}))} onLabelClick={() => navigateToGlossary('relevancy')} />
                <SpectrumSlider label="Clarity" value={structuralWeight.clarity} onChange={(v) => setStructuralWeight(p => ({...p, clarity: v}))} onLabelClick={() => navigateToGlossary('clarity')} />
                <SpectrumSlider label="Connectivity" value={structuralWeight.connectivity} onChange={(v) => setStructuralWeight(p => ({...p, connectivity: v}))} onLabelClick={() => navigateToGlossary('connectivity')} />
                <SpectrumSlider label="Precision" value={structuralWeight.precision} onChange={(v) => setStructuralWeight(p => ({...p, precision: v}))} onLabelClick={() => navigateToGlossary('precision')} />
                <SpectrumSlider label="Call to Action" value={structuralWeight.call_to_action} onChange={(v) => setStructuralWeight(p => ({...p, call_to_action: v}))} onLabelClick={() => navigateToGlossary('call_to_action')} />
              </div>
            </GlassCard>
          </section>

          <section className="min-w-0">
            <SectionHeader number="3️⃣" title="Vocal Cadence" />
            <GlassCard>
              <div className="px-8 py-6">
                <SpectrumSlider label="Relatability" value={vocalCadence.relatability} onChange={(v) => setVocalCadence(p => ({...p, relatability: v}))} onLabelClick={() => navigateToGlossary('relatability')} />
                <SpectrumSlider label="Pacing" value={vocalCadence.pacing} onChange={(v) => setVocalCadence(p => ({...p, pacing: v}))} onLabelClick={() => navigateToGlossary('pacing')} />
                <SpectrumSlider label="Enthusiasm" value={vocalCadence.enthusiasm} onChange={(v) => setVocalCadence(p => ({...p, enthusiasm: v}))} onLabelClick={() => navigateToGlossary('enthusiasm')} />
                <SpectrumSlider label="Charisma" value={vocalCadence.charisma} onChange={(v) => setVocalCadence(p => ({...p, charisma: v}))} onLabelClick={() => navigateToGlossary('charisma')} />
                <div className="h-[52px]"></div>
              </div>
            </GlassCard>
          </section>
        </div>

        {/* Critical Post-Analysis */}
        <section className="mb-6">
          <h3 className="text-base font-black uppercase tracking-[0.2em] italic text-center mb-4" style={{
            background: 'linear-gradient(90deg, #FF4500 0%, #D12D6F 50%, #8B008B 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Critical Post-Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { emoji: '⚡', color: '#F59E0B', label: 'Anchoring Point', key: 'anchoring_point', placeholder: 'Most impactful segment...' },
              { emoji: '📉', color: '#3B82F6', label: 'Structural Drift', key: 'structural_drift', placeholder: 'Loss of focus area...' },
              { emoji: '✅', color: '#10B981', label: 'Measurable Step', key: 'measurable_step', placeholder: 'Improvement task...' },
            ].map((item) => (
              <GlassCard key={item.key} className="h-full">
                <div className="px-6 py-5 h-full flex flex-col">
                  <label className="text-[8px] font-black text-white tracking-[0.3em] uppercase flex items-center gap-1 mb-2">
                    <span style={{ color: item.color }}>{item.emoji}</span> {item.label}
                  </label>
                  <textarea
                    placeholder={item.placeholder}
                    value={postAnalysis[item.key]}
                    onChange={(e) => setPostAnalysis(p => ({...p, [item.key]: e.target.value}))}
                    className="flex-1 bg-transparent border-0 focus:ring-0 focus:outline-none text-white placeholder:text-white/20 resize-none text-xs font-light font-mono min-h-[80px]"
                  />
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Calculate Score Button */}
        <section className="flex flex-col items-center justify-center py-6 mb-6">
          <GradientButton onClick={handleCalculateScore} disabled={totalScore === 0}>
            CALCULATE SCORE
          </GradientButton>

          {/* Evaluator Signature */}
          <div className="mt-8 w-full max-w-md">
            <GlassCard>
              <div className="px-8 py-6 space-y-4">
                <label className="text-[8px] font-black text-white tracking-[0.3em] uppercase text-center block">
                  Evaluator Signature
                </label>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => { setEvaluatorType('human'); setEvaluatorName(''); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-wider transition-all ${
                      evaluatorType === 'human'
                        ? 'bg-white/10 border border-white/20 text-white'
                        : 'bg-transparent border border-white/5 text-white/40 hover:text-white/60'
                    }`}
                  >
                    ✍️ Human
                  </button>
                  <button
                    onClick={() => { setEvaluatorType('ai'); setEvaluatorName('Gamaliel'); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-wider transition-all ${
                      evaluatorType === 'ai'
                        ? 'bg-white/10 border border-[#39ff14]/30 text-[#39ff14]'
                        : 'bg-transparent border border-white/5 text-white/40 hover:text-white/60'
                    }`}
                  >
                    🤖 AI Gamaliel
                  </button>
                </div>
                {evaluatorType === 'human' ? (
                  <input
                    type="text"
                    placeholder="Enter evaluator name..."
                    value={evaluatorName}
                    onChange={(e) => setEvaluatorName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-center focus:outline-none focus:ring-1 focus:ring-orange-500/50 [color-scheme:dark]"
                    style={{
                      borderRadius: '16px',
                      padding: '10px 14px',
                      fontFamily: "'League Script', cursive",
                      fontSize: '18px',
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center gap-2 py-2">
                    <span className="material-symbols-outlined text-[16px]" style={{ color: '#C026D3' }}>smart_toy</span>
                    <span
                      className="text-[16px] font-bold tracking-tight"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        background: 'linear-gradient(90deg, #D12D6F, #C026D3)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Gamaliel
                    </span>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 bg-black/40 safe-bottom">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-[8px] tracking-[0.5em] text-white/50 uppercase font-black">© 2026 THE SCRIBES INC.</p>
        </div>
      </footer>
    </>
  );

  // renderSummary is now handled by EvaluationSummaryPage component

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="min-h-screen text-white font-sans selection:bg-orange-500/30" style={{
      background: `radial-gradient(circle at 10% 10%, rgba(255, 69, 0, 0.12) 0%, transparent 40%), radial-gradient(circle at 90% 90%, rgba(139, 0, 139, 0.12) 0%, transparent 40%), radial-gradient(circle at 50% 50%, rgba(57, 255, 20, 0.02) 0%, transparent 50%), #070304`
    }}>
      {currentPage === 'loading' ? (
        <div className="min-h-screen flex items-center justify-center" style={{
          background: `radial-gradient(circle at 30% 20%, rgba(255, 69, 0, 0.15) 0%, transparent 40%),
                       radial-gradient(circle at 70% 80%, rgba(139, 0, 139, 0.2) 0%, transparent 40%),
                       #050203`,
        }}>
          <Logo height={48} showLabel={false} />
        </div>
      ) : currentPage === 'login' ? (
        <LoginPage
          onLogin={handleLogin}
          onOAuthLogin={handleOAuthLogin}
          onNavigateSignUp={() => { setCurrentPage('signup'); window.scrollTo(0, 0); }}
          onNavigateForgotPassword={() => { /* TODO: Forgot password flow */ }}
        />
      ) : currentPage === 'signup' ? (
        <SignUpPage
          onSignUp={handleSignUp}
          onOAuthLogin={handleOAuthLogin}
          onNavigateLogin={() => { setCurrentPage('login'); window.scrollTo(0, 0); }}
        />
      ) : currentPage === 'welcome-back' ? (
        <WelcomeBackPage onContinue={() => {
          if (isNewSignUp.current) {
            isNewSignUp.current = false;
            setCurrentPage('tour');
          } else {
            setCurrentPage('dashboard');
          }
          window.scrollTo(0, 0);
        }} />
      ) : currentPage === 'tour' ? (
        <GuidedTourPage onBack={() => { setCurrentPage('dashboard'); window.scrollTo(0, 0); }} onSkip={() => { setCurrentPage('dashboard'); window.scrollTo(0, 0); }} onLogoClick={navigateHome} />
      ) : currentPage === 'glossary' ? (
        <GlossaryPage scrollToTerm={glossaryTerm} onBack={() => { setCurrentPage('dashboard'); window.scrollTo(0, 0); }} onLogoClick={navigateHome} />
      ) : currentPage === 'history' ? (
        <EvaluationHistoryPage evaluations={savedEvaluations} onBack={() => { setCurrentPage('dashboard'); window.scrollTo(0, 0); }} onLogoClick={navigateHome} />
      ) : currentPage === 'summary' ? (
        <EvaluationSummaryPage
          totalScore={totalScore}
          sacredFoundation={sacredFoundation}
          structuralWeight={structuralWeight}
          vocalCadence={vocalCadence}
          postAnalysis={postAnalysis}
          evaluator={{ type: evaluatorType, name: evaluatorType === 'ai' ? 'Gamaliel' : evaluatorName }}
          onBack={() => { setCurrentPage('dashboard'); window.scrollTo(0, 0); }}
          onNewEvaluation={handleNewEvaluation}
          onLogoClick={navigateHome}
        />
      ) : (
        renderDashboard()
      )}

      {/* Custom styles */}
      <style>{`
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--thumb-color, #FF4500);
          border: 2px solid white;
          box-shadow: 0 0 12px var(--thumb-color, #FF4500);
          cursor: pointer;
        }
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--thumb-color, #FF4500);
          border: 2px solid white;
          box-shadow: 0 0 12px var(--thumb-color, #FF4500);
          cursor: pointer;
        }

        @keyframes spin-coin {
          0% { transform: perspective(1000px) rotateY(0deg); }
          100% { transform: perspective(1000px) rotateY(2880deg); }
        }
        .animate-spin-coin {
          animation: spin-coin 4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        /* iOS safe area support */
        .safe-top { padding-top: env(safe-area-inset-top, 0px); }
        .safe-bottom { padding-bottom: env(safe-area-inset-bottom, 0px); }
        .safe-left { padding-left: env(safe-area-inset-left, 0px); }
        .safe-right { padding-right: env(safe-area-inset-right, 0px); }

        /* Mobile touch optimizations */
        * { -webkit-tap-highlight-color: transparent; }
        button, [role="button"], input[type="range"] {
          touch-action: manipulation;
        }

        /* Prevent iOS auto-zoom on input focus (font-size < 16px triggers zoom) */
        @media screen and (max-width: 768px) {
          input[type="text"],
          input[type="date"],
          input[type="email"],
          input[type="password"],
          textarea,
          select {
            font-size: 16px !important;
          }
        }

        /* Mobile-friendly slider thumb */
        @media (pointer: coarse) {
          input[type="range"]::-webkit-slider-thumb {
            width: 24px;
            height: 24px;
          }
          input[type="range"]::-moz-range-thumb {
            width: 24px;
            height: 24px;
          }
        }

        /* Hide scrollbar on nav overflow (iOS) */
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
