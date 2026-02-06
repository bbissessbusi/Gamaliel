import React, { useState, useEffect } from 'react';

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

// Get score color based on total (0-90)
const getScoreTheme = (score) => {
  if (score >= 80) {
    return { color: '#8B008B', gradient: 'linear-gradient(135deg, #8B008B 0%, #6B006B 100%)', emoji: '\u{1F451}' };
  } else if (score >= 50) {
    return { color: '#D12D6F', gradient: 'linear-gradient(135deg, #D12D6F 0%, #A11D5F 100%)', emoji: '' };
  } else {
    return { color: '#FF4500', gradient: 'linear-gradient(135deg, #FF4500 0%, #CC3700 100%)', emoji: '' };
  }
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
        borderRadius: isCircle ? '50%' : '32px',
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
          borderRadius: isCircle ? '50%' : '32px',
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

// Logo component with embedded SVG
const Logo = ({ height = 28, opacity = 1 }) => (
  <div style={{ height: `${height}px`, opacity, display: 'flex', alignItems: 'center', gap: '8px' }}>
    <svg height={height} viewBox="0 0 60 40">
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF00FF" />
          <stop offset="50%" stopColor="#8B00FF" />
          <stop offset="100%" stopColor="#0066FF" />
        </linearGradient>
      </defs>
      <text x="5" y="32" fill="url(#logoGrad)" fontSize="32" fontWeight="bold" fontFamily="serif" fontStyle="italic">G</text>
      <text x="28" y="32" fill="url(#logoGrad)" fontSize="32" fontWeight="bold" fontFamily="serif" fontStyle="italic">L</text>
    </svg>
    <span style={{ fontSize: '8px', fontWeight: 900, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.6)' }}>GAMALIEL</span>
  </div>
);

// ============================================================================
// DASHBOARD COMPONENTS
// ============================================================================

const SpectrumSlider = ({ label, value, onChange }) => {
  const color = getSliderColor(value);
  const percentage = (value / 10) * 100;

  return (
    <div className="mb-4">
      <div className="flex justify-between items-end mb-2">
        <label className="font-bold text-[10px] uppercase tracking-[0.2em] text-white">{label}</label>
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

const CheckboxItem = ({ label, subtitle, checked, onToggle }) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <div
      className={`relative flex-shrink-0 w-6 h-6 border flex items-center justify-center transition-all ${checked ? 'border-transparent bg-transparent' : 'border-white/20 bg-black/40 group-hover:border-orange-500/50'}`}
      style={{ borderRadius: '8px' }}
      onClick={onToggle}
    >
      {checked && <span className="text-xl">{'\u2705'}</span>}
    </div>
    <div className="flex flex-col">
      <span className="font-bold text-white text-xs tracking-tight uppercase">{label}</span>
      <span className="text-[8px] text-white/70 uppercase font-bold tracking-widest">{subtitle}</span>
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
// EVALUATION SUMMARY COMPONENTS
// ============================================================================

const ScoreCircle = ({ score, maxScore = 90, isAnimating }) => {
  const theme = getScoreTheme(score);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setShowContent(true), 3800);
      return () => clearTimeout(timer);
    } else {
      setShowContent(true);
    }
  }, [isAnimating]);

  return (
    <div
      className={`relative w-56 h-56 md:w-64 md:h-64 flex items-center justify-center ${isAnimating ? 'animate-spin-coin' : ''}`}
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(24px)',
        borderRadius: '20px',
        boxShadow: `0 0 60px ${theme.color}33`,
      }}
    >
      {/* Gradient border */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: '20px',
          padding: '1.5px',
          background: `linear-gradient(135deg, #FF4500, #D12D6F, ${theme.color})`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          opacity: 0.6
        }}
      />
      {/* Glints */}
      <div className="absolute top-0 left-[10%] right-[10%] h-[1px]" style={{
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)'
      }} />
      <div className="absolute top-0 bottom-0 left-0 w-[1px]" style={{
        background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.4), transparent)'
      }} />

      {/* Content */}
      <div className={`flex flex-col items-center transition-all duration-500 ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-80'}`}>
        <span className="text-[10px] font-black tracking-[0.4em] uppercase text-white/40 mb-2">Final Tally</span>
        <div className="flex items-center gap-2">
          {theme.emoji && <span className="text-4xl">{theme.emoji}</span>}
          <span className="text-6xl md:text-7xl font-black text-white font-mono">
            {score}<span style={{ color: `${theme.color}60` }}>/</span>{maxScore}
          </span>
        </div>
      </div>
    </div>
  );
};

const ScoreBar = ({ label, score, maxScore = 10 }) => {
  const percentage = (score / maxScore) * 100;

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex justify-between text-[9px] font-bold uppercase tracking-[0.2em] text-white/80">
        <span>{label}</span>
        <span className="text-[#FF4500] font-mono">{String(score).padStart(2, '0')}/{maxScore}</span>
      </div>
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-1000 ease-out"
          style={{
            width: `${percentage}%`,
            background: 'linear-gradient(90deg, #FF4500 0%, #D12D6F 100%)'
          }}
        />
      </div>
    </div>
  );
};

const FoundationItem = ({ label, checked }) => (
  <li className="flex items-center gap-3">
    <div className="w-5 h-5 flex items-center justify-center">
      <span className="text-[12px]">{checked ? '\u2705' : '\u274C'}</span>
    </div>
    <span className="text-[10px] font-bold uppercase tracking-widest text-white/90">{label}</span>
  </li>
);

const PostAnalysisCard = ({ emoji, emojiColor, label, labelColor, content }) => (
  <GlassCard className="p-6 md:p-8 h-full">
    <div className="flex flex-col gap-4 h-full">
      <label className="text-[9px] font-black tracking-[0.4em] uppercase flex items-center gap-2.5" style={{ color: labelColor }}>
        <span style={{ color: emojiColor }}>{emoji}</span> {label}
      </label>
      <p className="text-[11px] leading-relaxed text-white/80 font-light">{content}</p>
    </div>
  </GlassCard>
);

// ============================================================================
// MAIN APP WITH PAGE NAVIGATION
// ============================================================================

export default function GamalielApp() {
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard' | 'summary'
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState('');

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

  // Post Analysis
  const [postAnalysis, setPostAnalysis] = useState({
    anchoring_point: '',
    structural_drift: '',
    measurable_step: '',
  });

  // Calculate total score
  const totalScore = Object.values(structuralWeight).reduce((a, b) => a + b, 0) +
    Object.values(vocalCadence).reduce((a, b) => a + b, 0);

  // Simulate Gamaliel AI Analysis
  const handleGamalielAnalysis = async () => {
    setIsAnalyzing(true);

    // Simulate transcription
    setAnalysisStatus('Recording sermon audio...');
    await new Promise(r => setTimeout(r, 1500));

    setAnalysisStatus('Transcribing with AssemblyAI...');
    await new Promise(r => setTimeout(r, 2000));

    setAnalysisStatus('Analyzing with Gamaliel AI...');
    await new Promise(r => setTimeout(r, 2000));

    // Simulate AI filling in all fields
    setSacredFoundation({
      theological_fidelity: true,
      exegetical_soundness: true,
      gospel_centrality: true,
    });

    setStructuralWeight({
      relevancy: 8,
      clarity: 9,
      connectivity: 8,
      precision: 8,
      call_to_action: 9,
    });

    setVocalCadence({
      relatability: 9,
      pacing: 7,
      enthusiasm: 9,
      charisma: 8,
    });

    setPostAnalysis({
      anchoring_point: 'The transition into the third point maintained high engagement through a visceral metaphor that grounded abstract theology in lived experience.',
      structural_drift: 'The middle section expanded too far into historical context, causing a brief loss of connection with practical audience application.',
      measurable_step: 'Reduce historical preamble by 40% in the next sermon to preserve rhythmic momentum and maintain focus on application.',
    });

    setAnalysisStatus('Analysis complete!');
    await new Promise(r => setTimeout(r, 500));

    setIsAnalyzing(false);
    setAnalysisStatus('');
  };

  // Handle Calculate Score - saves and navigates to summary
  const handleCalculateScore = () => {
    // In production: Save to Supabase here
    console.log('Saving to Supabase...', {
      sermonTitle, preachDate, primaryGoal,
      sacredFoundation, structuralWeight, vocalCadence, postAnalysis,
      totalScore
    });

    // Navigate to summary page and scroll to the very top
    setCurrentPage('summary');
    window.scrollTo(0, 0);
  };

  // Reset and return to dashboard
  const handleNewEvaluation = () => {
    // Reset all fields
    setSermonTitle('');
    setPreachDate('');
    setPrimaryGoal('');
    setSacredFoundation({ theological_fidelity: false, exegetical_soundness: false, gospel_centrality: false });
    setStructuralWeight({ relevancy: 0, clarity: 0, connectivity: 0, precision: 0, call_to_action: 0 });
    setVocalCadence({ relatability: 0, pacing: 0, enthusiasm: 0, charisma: 0 });
    setPostAnalysis({ anchoring_point: '', structural_drift: '', measurable_step: '' });
    setRecordingStatus('ready');

    // Return to dashboard and scroll to top
    setCurrentPage('dashboard');
    window.scrollTo(0, 0);
  };

  // ============================================================================
  // RENDER DASHBOARD PAGE
  // ============================================================================

  const renderDashboard = () => (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#070304]/80 backdrop-blur-2xl">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Logo height={28} />
          <GradientButton small>SAVE</GradientButton>
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
            }}>HOMILETICS</span>
            <br />
            <span style={{ color: '#FF4500' }}>SCORECARD</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)' }} className="text-sm font-light leading-relaxed max-w-md">
            Premium digital analysis of sermon weight, structure, and delivery. Designed for intentional preachers.
          </p>
        </section>

        {/* Sermon Info Card */}
        <GlassCard className="mb-6">
          <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField label="Sermon Title/Text" emoji={'\uD83D\uDCD6'} placeholder="e.g. Romans 8:1-4" value={sermonTitle} onChange={(e) => setSermonTitle(e.target.value)} />
            <InputField label="Preach Date" emoji={'\uD83D\uDCC5'} type="date" value={preachDate} onChange={(e) => setPreachDate(e.target.value)} />
            <InputField label="Primary Goal" emoji={'\uD83C\uDFAF'} placeholder="The core objective" value={primaryGoal} onChange={(e) => setPrimaryGoal(e.target.value)} />
          </div>
        </GlassCard>

        {/* Digital Capture Section */}
        <section className="mb-6">
          <SectionHeader emoji={'\uD83D\uDCF9'} title="Digital Capture" />
          <GlassCard>
            <div className="p-5">
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

                {/* Analysis Status */}
                {isAnalyzing && (
                  <div className="bg-[#39ff14]/10 border border-[#39ff14]/30 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 border-2 border-[#39ff14] border-t-transparent rounded-full animate-spin" />
                      <span className="text-[10px] font-mono text-[#39ff14]">{analysisStatus}</span>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  {/* AI Assistant Button */}
                  <PillContainer
                    className="flex items-center gap-3 px-4 py-2.5 hover:border-[#39ff14]/30 transition-all cursor-pointer flex-1 min-w-[200px]"
                    onClick={handleGamalielAnalysis}
                  >
                    <div className="flex flex-col flex-1">
                      <span className="text-[7px] font-mono font-bold text-[#39ff14] uppercase tracking-[0.2em]">{'\uD83E\uDD16'} Gamaliel AI Assistant</span>
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
                        <span className="text-sm">{'\uD83C\uDF99\uFE0F'}</span>
                        <span className="text-[8px] font-bold uppercase tracking-wider">Voice</span>
                      </button>
                      <div className="w-px h-4 bg-white/10" />
                      <button onClick={() => setMediaType('video')} className={`flex items-center gap-1 transition-colors ${mediaType === 'video' ? 'text-[#FF4500]' : 'text-white/60 hover:text-white'}`}>
                        <span className="text-sm">{'\uD83D\uDCF9'}</span>
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
          <SectionHeader number="1\uFE0F\u20E3" title="Sacred Foundation" />
          <GlassCard>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <CheckboxItem label="Theological Fidelity" subtitle="Doctrinal accuracy" checked={sacredFoundation.theological_fidelity} onToggle={() => setSacredFoundation(p => ({...p, theological_fidelity: !p.theological_fidelity}))} />
              <CheckboxItem label="Exegetical Soundness" subtitle="Contextual integrity" checked={sacredFoundation.exegetical_soundness} onToggle={() => setSacredFoundation(p => ({...p, exegetical_soundness: !p.exegetical_soundness}))} />
              <CheckboxItem label="Gospel Centrality" subtitle="Christ-focused" checked={sacredFoundation.gospel_centrality} onToggle={() => setSacredFoundation(p => ({...p, gospel_centrality: !p.gospel_centrality}))} />
            </div>
          </GlassCard>
        </section>

        {/* Sections 2 & 3 Side by Side */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <section className="min-w-0">
            <SectionHeader number="2\uFE0F\u20E3" title="Structural Weight" />
            <GlassCard>
              <div className="p-4">
                <SpectrumSlider label="Relevancy" value={structuralWeight.relevancy} onChange={(v) => setStructuralWeight(p => ({...p, relevancy: v}))} />
                <SpectrumSlider label="Clarity" value={structuralWeight.clarity} onChange={(v) => setStructuralWeight(p => ({...p, clarity: v}))} />
                <SpectrumSlider label="Connectivity" value={structuralWeight.connectivity} onChange={(v) => setStructuralWeight(p => ({...p, connectivity: v}))} />
                <SpectrumSlider label="Precision" value={structuralWeight.precision} onChange={(v) => setStructuralWeight(p => ({...p, precision: v}))} />
                <SpectrumSlider label="Call to Action" value={structuralWeight.call_to_action} onChange={(v) => setStructuralWeight(p => ({...p, call_to_action: v}))} />
              </div>
            </GlassCard>
          </section>

          <section className="min-w-0">
            <SectionHeader number="3\uFE0F\u20E3" title="Vocal Cadence" />
            <GlassCard>
              <div className="p-4">
                <SpectrumSlider label="Relatability" value={vocalCadence.relatability} onChange={(v) => setVocalCadence(p => ({...p, relatability: v}))} />
                <SpectrumSlider label="Pacing" value={vocalCadence.pacing} onChange={(v) => setVocalCadence(p => ({...p, pacing: v}))} />
                <SpectrumSlider label="Enthusiasm" value={vocalCadence.enthusiasm} onChange={(v) => setVocalCadence(p => ({...p, enthusiasm: v}))} />
                <SpectrumSlider label="Charisma" value={vocalCadence.charisma} onChange={(v) => setVocalCadence(p => ({...p, charisma: v}))} />
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
              { emoji: '\u26A1', color: '#F59E0B', label: 'Anchoring Point', key: 'anchoring_point', placeholder: 'Describe the most impactful segment...' },
              { emoji: '\uD83D\uDCC9', color: '#3B82F6', label: 'Structural Drift', key: 'structural_drift', placeholder: 'Identify loss of focus...' },
              { emoji: '\u2705', color: '#10B981', label: 'Measurable Step', key: 'measurable_step', placeholder: 'Specific improvement task...' },
            ].map((item) => (
              <GlassCard key={item.key} className="h-full">
                <div className="p-4 h-full flex flex-col">
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
          <p className="text-[9px] text-white/40 mt-3">Current Score: {totalScore}/90</p>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 bg-black/40">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-3">
          <Logo height={24} opacity={0.7} />
          <p className="text-[8px] tracking-[0.5em] text-white/50 uppercase font-black">{'\u00A9'} 2026 THE SCRIBES INC.</p>
        </div>
      </footer>
    </>
  );

  // ============================================================================
  // RENDER EVALUATION SUMMARY PAGE
  // ============================================================================

  const renderSummary = () => {
    const theme = getScoreTheme(totalScore);

    return (
      <>
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-white/5 bg-[#070304]/80 backdrop-blur-2xl">
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <Logo height={28} />
            <button
              onClick={() => { setCurrentPage('dashboard'); window.scrollTo(0, 0); }}
              className="text-[10px] font-bold tracking-[0.2em] text-white/60 hover:text-white transition-colors uppercase"
            >
              {'\u2190'} BACK
            </button>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-12 md:py-20 space-y-16">
          {/* Score Circle Section */}
          <section className="flex flex-col items-center text-center space-y-8">
            <h1 className="text-[10px] md:text-xs font-mono font-bold tracking-[0.8em] uppercase" style={{ color: '#FF4500' }}>
              Evaluation Summary
            </h1>
            <ScoreCircle score={totalScore} isAnimating={true} />
          </section>

          {/* Scores Breakdown */}
          <section>
            <GlassCard className="p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Sacred Foundation */}
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black tracking-[0.5em] uppercase border-b border-white/5 pb-4" style={{ color: '#8B008B' }}>
                    Sacred Foundation
                  </h3>
                  <ul className="space-y-4">
                    <FoundationItem label="Theological Fidelity" checked={sacredFoundation.theological_fidelity} />
                    <FoundationItem label="Exegetical Soundness" checked={sacredFoundation.exegetical_soundness} />
                    <FoundationItem label="Gospel Centrality" checked={sacredFoundation.gospel_centrality} />
                  </ul>
                </div>

                {/* Structural Weight */}
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black tracking-[0.5em] uppercase border-b border-white/5 pb-4" style={{ color: '#8B008B' }}>
                    Structural Weight
                  </h3>
                  <div className="space-y-5">
                    <ScoreBar label="Relevancy" score={structuralWeight.relevancy} />
                    <ScoreBar label="Clarity" score={structuralWeight.clarity} />
                    <ScoreBar label="Connectivity" score={structuralWeight.connectivity} />
                    <ScoreBar label="Precision" score={structuralWeight.precision} />
                    <ScoreBar label="Call to Action" score={structuralWeight.call_to_action} />
                  </div>
                </div>

                {/* Vocal Cadence */}
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black tracking-[0.5em] uppercase border-b border-white/5 pb-4" style={{ color: '#8B008B' }}>
                    Vocal Cadence
                  </h3>
                  <div className="space-y-5">
                    <ScoreBar label="Relatability" score={vocalCadence.relatability} />
                    <ScoreBar label="Pacing" score={vocalCadence.pacing} />
                    <ScoreBar label="Enthusiasm" score={vocalCadence.enthusiasm} />
                    <ScoreBar label="Charisma" score={vocalCadence.charisma} />
                  </div>
                </div>
              </div>
            </GlassCard>
          </section>

          {/* Post-Evaluation Analysis */}
          <section className="space-y-6">
            <h3 className="text-[10px] font-black text-center tracking-[0.6em] uppercase text-white/30">
              Post-Evaluation Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <PostAnalysisCard
                emoji={'\u26A1'} emojiColor="#F59E0B"
                label="Anchoring Point" labelColor="#FF4500"
                content={postAnalysis.anchoring_point || 'No anchoring point recorded.'}
              />
              <PostAnalysisCard
                emoji={'\uD83D\uDCC9'} emojiColor="#3B82F6"
                label="Structural Drift" labelColor="#D12D6F"
                content={postAnalysis.structural_drift || 'No structural drift identified.'}
              />
              <PostAnalysisCard
                emoji={'\u2705'} emojiColor="#10B981"
                label="Measurable Step" labelColor="#8B008B"
                content={postAnalysis.measurable_step || 'No measurable step recorded.'}
              />
            </div>
          </section>

          {/* New Evaluation Button */}
          <section className="flex justify-center pt-4">
            <GradientButton onClick={handleNewEvaluation} className="px-16 py-6">
              Start a New Evaluation
            </GradientButton>
          </section>
        </main>

        {/* Footer */}
        <footer className="py-16 mt-16 border-t border-white/5">
          <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
            <Logo height={24} opacity={0.4} />
            <p className="text-[8px] tracking-[0.8em] text-white/20 uppercase font-black">
              {'\u00A9'} 2026 THE SCRIBES INC. {'\u2022'} WE FIX WHAT MARKETING CANNOT
            </p>
          </div>
        </footer>
      </>
    );
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="min-h-screen text-white font-sans selection:bg-orange-500/30" style={{
      background: `radial-gradient(circle at 10% 10%, rgba(255, 69, 0, 0.12) 0%, transparent 40%), radial-gradient(circle at 90% 90%, rgba(139, 0, 139, 0.12) 0%, transparent 40%), radial-gradient(circle at 50% 50%, rgba(57, 255, 20, 0.02) 0%, transparent 50%), #070304`
    }}>
      {currentPage === 'dashboard' ? renderDashboard() : renderSummary()}

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
      `}</style>
    </div>
  );
}
