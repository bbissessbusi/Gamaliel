import React, { useState, useEffect } from 'react';
import Logo from './components/Logo';

// ============================================================================
// TOUR STEPS - Guides through ALL pages
// ============================================================================

const TOUR_STEPS = [
  {
    id: 'dashboard',
    title: 'The Scorecard',
    subtitle: 'Your Command Center',
    icon: '📋',
    description: 'Enter sermon details — title, date, and primary goal. This is where every evaluation begins.',
    preview: 'dashboard',
  },
  {
    id: 'capture',
    title: 'Digital Capture',
    subtitle: 'AI-Powered Analysis',
    icon: '📹',
    description: 'Upload or record your sermon. Gamaliel AI listens and transcribes, then scores your delivery across every metric automatically.',
    preview: 'capture',
  },
  {
    id: 'scoring',
    title: 'Scoring Framework',
    subtitle: 'Three Pillars of Excellence',
    icon: '📊',
    description: 'Sacred Foundation (pass/fail checkboxes), Structural Weight (0-10 sliders), and Vocal Cadence (0-10 sliders) combine into your Composite Homiletics Index out of 90.',
    preview: 'scoring',
  },
  {
    id: 'lexicon',
    title: 'Refined Lexicon',
    subtitle: 'The Language of Preaching',
    icon: '📖',
    description: 'Every scoring term is defined with its etymology and application. Tap any term label on the scorecard to jump directly to its definition in the glossary.',
    preview: 'lexicon',
  },
  {
    id: 'history',
    title: 'Evaluation History',
    subtitle: 'Track Your Growth',
    icon: '📈',
    description: 'Every completed evaluation is saved to your account. Review past scores, compare progress over time, and see how your preaching evolves.',
    preview: 'history',
  },
  {
    id: 'summary',
    title: 'Score Summary',
    subtitle: 'Your Final Report',
    icon: '🏆',
    description: 'After calculating your score, see a beautiful breakdown of every metric with your Composite Homiletics Index, evaluator signature, and post-analysis insights.',
    preview: 'summary',
  },
];

// ============================================================================
// TOUR GLASS CARD
// ============================================================================

const TourGlassCard = ({ children, className = '' }) => (
  <div className={`tour-glass-card tour-glass-card-outline ${className}`}>
    <div className="absolute inset-0 pointer-events-none z-30" style={{ borderRadius: 'inherit' }}>
      <div
        className="absolute top-0 left-[10%] right-[10%] h-[1px]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.1), transparent)',
          filter: 'blur(0.2px)',
        }}
      />
    </div>
    {children}
  </div>
);

// ============================================================================
// STEP PREVIEW CONTENT
// ============================================================================

const StepPreview = ({ stepId }) => {
  switch (stepId) {
    case 'dashboard':
      return (
        <div className="space-y-3 relative z-40">
          {[
            { emoji: '📖', label: 'Sermon Title/Text', value: 'e.g. Romans 8:1-4' },
            { emoji: '📅', label: 'Preach Date', value: '2026-02-09' },
            { emoji: '🎯', label: 'Primary Goal', value: 'The core objective' },
          ].map((field) => (
            <div key={field.label} className="flex flex-col gap-1.5">
              <label className="text-[8px] font-black text-white tracking-[0.3em] uppercase flex items-center gap-1">
                <span className="text-[10px]">{field.emoji}</span> {field.label}
              </label>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-white/40 text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {field.value}
              </div>
            </div>
          ))}
        </div>
      );
    case 'capture':
      return (
        <div className="space-y-4 relative z-40">
          <div className="flex items-center gap-4 bg-white/5 rounded-2xl px-5 py-3 border border-white/5">
            <div className="flex flex-col flex-1">
              <span className="text-[7px] font-bold text-[#39ff14] uppercase tracking-[0.2em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                🤖 Gamaliel AI Assistant
              </span>
              <span className="text-white text-[9px] font-bold uppercase tracking-widest mt-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                Start AI Analysis
              </span>
            </div>
            <div className="w-3 h-3 rounded-full bg-[#39ff14]" style={{ boxShadow: '0 0 10px rgba(57,255,20,0.6)' }} />
          </div>
          <div className="flex items-center gap-3 justify-center">
            <div className="w-12 h-12 rounded-full border-2 border-orange-500/30 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-[#FF4500]" style={{ boxShadow: '0 0 15px #FF4500' }} />
            </div>
            <span className="text-[8px] text-white uppercase font-black tracking-[0.3em]">Ready</span>
          </div>
        </div>
      );
    case 'scoring':
      return (
        <div className="space-y-4 relative z-40">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            {['Theological Fidelity', 'Exegetical', 'Gospel'].map((label) => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-4 h-4 border border-white/20 rounded bg-black/40" />
                <span className="text-[7px] sm:text-[8px] font-bold text-white uppercase tracking-tight">{label}</span>
              </div>
            ))}
          </div>
          {['Relevancy', 'Pacing'].map((label, i) => (
            <div key={label} className="space-y-1.5">
              <div className="flex justify-between items-end">
                <span className="font-bold text-[9px] uppercase tracking-[0.15em] text-white">{label}</span>
                <span className="text-[9px] font-black text-[#FF4500]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{i === 0 ? '08' : '07'}</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full relative">
                <div className="absolute left-0 top-0 h-full bg-[#FF4500] rounded-full" style={{ width: i === 0 ? '80%' : '70%' }} />
              </div>
            </div>
          ))}
        </div>
      );
    case 'lexicon':
      return (
        <div className="space-y-3 relative z-40">
          {['Fidelity', 'Exegesis', 'Clarity'].map((term) => (
            <div key={term} className="bg-white/5 border border-white/10 rounded-xl p-3">
              <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">{term}</h4>
              <p className="text-[8px] text-white/50 italic">Tap to explore definition and etymology</p>
            </div>
          ))}
        </div>
      );
    case 'history':
      return (
        <div className="grid grid-cols-2 gap-3 relative z-40">
          {[{ score: '94.2', title: 'Fidelity Path' }, { score: '88.5', title: 'Grace Architecture' }].map((card) => (
            <div key={card.title} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <span className="text-2xl font-black text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{card.score}</span>
              <p className="text-[8px] text-white/50 mt-1 uppercase tracking-wider">{card.title}</p>
            </div>
          ))}
        </div>
      );
    case 'summary':
      return (
        <div className="flex flex-col items-center gap-4 relative z-40">
          <div className="w-20 h-20 rounded-full border border-white/10 flex flex-col items-center justify-center bg-white/5">
            <span className="text-[7px] font-black uppercase text-white/40 tracking-wider">Index</span>
            <span className="text-xl font-black text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>72/90</span>
          </div>
          <span className="text-[8px] text-white/40 uppercase tracking-widest">Composite Homiletics Index</span>
        </div>
      );
    default:
      return null;
  }
};

// ============================================================================
// MAIN GUIDED TOUR PAGE
// ============================================================================

export default function GuidedTourPage({ onBack, onSkip, onLogoClick }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const step = TOUR_STEPS[currentStep];
  const isLastStep = currentStep === TOUR_STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      (onSkip || onBack)();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    (onSkip || onBack)();
  };

  return (
    <div
      className="min-h-screen text-white selection:bg-orange-500/30 relative overflow-x-hidden"
      style={{
        fontFamily: "'Space Grotesk', sans-serif",
        background: `radial-gradient(circle at 10% 10%, rgba(255, 69, 0, 0.12) 0%, transparent 40%),
                     radial-gradient(circle at 90% 90%, rgba(139, 0, 139, 0.12) 0%, transparent 40%),
                     radial-gradient(circle at 50% 50%, rgba(57, 255, 20, 0.02) 0%, transparent 50%),
                     #070304`,
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Header */}
      <header className="sticky top-0 z-[100] border-b border-white/5 backdrop-blur-2xl" style={{ background: 'rgba(7, 3, 4, 0.8)', paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
          <Logo height={28} onClick={onLogoClick} />
          <button
            onClick={handleSkip}
            className="bg-white/5 border border-white/10 text-white px-4 md:px-6 py-2 rounded-lg md:rounded-xl font-bold text-[8px] md:text-[10px] tracking-[0.2em] transition-all hover:bg-white/10 uppercase"
            style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }}
          >
            SKIP TOUR
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-16">
        {/* Step Indicator Dots */}
        <div className="flex items-center justify-center gap-1.5 md:gap-2 mb-8 md:mb-12">
          {TOUR_STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrentStep(i)}
              className="flex items-center justify-center"
              style={{ minWidth: '28px', minHeight: '28px', padding: '8px', cursor: 'pointer', background: 'none', border: 'none' }}
            >
              <div
                style={{
                  width: i === currentStep ? '28px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: i === currentStep
                    ? 'linear-gradient(90deg, #FF4500, #8B008B)'
                    : i < currentStep
                      ? 'rgba(255, 69, 0, 0.4)'
                      : 'rgba(255, 255, 255, 0.15)',
                  transition: 'all 0.3s ease',
                }}
              />
            </button>
          ))}
        </div>

        {/* Step Counter */}
        <div className="text-center mb-6 md:mb-8">
          <span
            className="text-[9px] font-black tracking-[0.5em] uppercase"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              background: 'linear-gradient(90deg, #FF4500, #D12D6F)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Step {currentStep + 1} of {TOUR_STEPS.length}
          </span>
        </div>

        {/* Step Icon & Title */}
        <div className="text-center mb-8 md:mb-12">
          <span className="text-4xl md:text-5xl mb-4 block">{step.icon}</span>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight mb-2"
            style={{
              background: 'linear-gradient(90deg, #FF4500 0%, #D12D6F 50%, #8B008B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {step.title}
          </h2>
          <p
            className="text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase text-white/40"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {step.subtitle}
          </p>
        </div>

        {/* Step Description */}
        <div className="text-center mb-8 md:mb-12 max-w-lg mx-auto">
          <p className="text-sm md:text-base text-white/80 font-light leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Step Preview Card */}
        <TourGlassCard className="p-6 md:p-10 mb-10 md:mb-16">
          <StepPreview stepId={step.preview} />
        </TourGlassCard>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handlePrev}
            disabled={isFirstStep}
            className="flex items-center gap-2 px-4 md:px-6 py-3 rounded-xl text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] transition-all"
            style={{
              minHeight: '48px',
              background: isFirstStep ? 'transparent' : 'rgba(255, 255, 255, 0.05)',
              border: isFirstStep ? '1px solid transparent' : '1px solid rgba(255, 255, 255, 0.1)',
              color: isFirstStep ? 'rgba(255, 255, 255, 0.2)' : 'white',
              cursor: isFirstStep ? 'default' : 'pointer',
            }}
          >
            <span>⬅️</span> Back
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 md:px-10 py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-white transition-all active:scale-95"
            style={{
              minHeight: '48px',
              background: 'linear-gradient(90deg, #FF4500 0%, #8B008B 100%)',
              boxShadow: '0 10px 30px -10px rgba(255, 69, 0, 0.5)',
            }}
          >
            {isLastStep ? 'Start Using App' : 'Next'} <span>{isLastStep ? '🚀' : '➡️'}</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-12" style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom, 0px))' }}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[8px] md:text-[9px] tracking-[0.5em] text-white/40 uppercase font-black">
            © 2026 SCRIBE INC.
          </p>
        </div>
      </footer>

      {/* Scoped styles */}
      <style>{`
        .tour-glass-card {
          position: relative;
          transition: all 0.3s;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.015);
          backdrop-filter: blur(12px) saturate(180%);
          -webkit-backdrop-filter: blur(12px) saturate(180%);
          transform-style: preserve-3d;
          border-radius: 2rem;
        }
        @media (min-width: 768px) {
          .tour-glass-card {
            border-radius: 3.5rem;
          }
        }
        .tour-glass-card-outline::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(135deg, #FF4500, #D12D6F, #8B008B);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          opacity: 0.3;
          z-index: 20;
          transition: opacity 0.3s ease;
        }
      `}</style>
    </div>
  );
}
