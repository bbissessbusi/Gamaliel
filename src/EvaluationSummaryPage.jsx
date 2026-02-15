import React, { useState, useEffect } from 'react';
import Logo from './components/Logo';

// ============================================================================
// SCORE THEME HELPER
// ============================================================================

const getScoreTheme = (score) => {
  if (score >= 80) return { color: '#8B008B', emoji: '👑' };
  if (score >= 50) return { color: '#D12D6F', emoji: '' };
  return { color: '#FF4500', emoji: '' };
};

// ============================================================================
// SCORE CIRCLE WITH COIN SPIN ANIMATION
// ============================================================================

const ScoreCircle = ({ score, maxScore = 90 }) => {
  const [showContent, setShowContent] = useState(false);
  const theme = getScoreTheme(score);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 3800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="summary-coin-spin summary-glass-card summary-glass-card-outline w-56 h-56 md:w-64 md:h-64 flex flex-col items-center justify-center score-circle-container">
      <div className="summary-glass-glint" />
      <div className="summary-glass-glint-side" />
      <div
        className="summary-animate-content flex flex-col items-center"
        style={{
          animation: 'summary-reveal-score 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          animationDelay: '3.8s',
          opacity: 0,
        }}
      >
        <span className="text-[10px] font-black tracking-[0.4em] uppercase text-white/40 mb-2">
          Final Tally
        </span>
        <div className="flex items-center gap-2">
          {theme.emoji && <span className="text-4xl">{theme.emoji}</span>}
          <span
            className="text-6xl md:text-7xl font-black text-white"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {score}
            <span style={{ color: `${theme.color}60` }}>/</span>
            {maxScore}
          </span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SCORE BAR
// ============================================================================

const ScoreBar = ({ label, score, maxScore = 10 }) => {
  const percentage = (score / maxScore) * 100;
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex justify-between text-[9px] font-bold uppercase tracking-[0.2em] text-white/80">
        <span>{label}</span>
        <span className="text-[#FF4500]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {String(score).padStart(2, '0')}/{maxScore}
        </span>
      </div>
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full summary-score-bar-gradient transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// ============================================================================
// FOUNDATION ITEM (PASS/FAIL)
// ============================================================================

const FoundationItem = ({ label, checked }) => (
  <li className="flex items-center gap-3">
    <div className="w-5 h-5 flex items-center justify-center">
      <span className="text-[12px]">{checked ? '✅' : '❌'}</span>
    </div>
    <span className="text-[10px] font-bold uppercase tracking-widest text-white/90">{label}</span>
  </li>
);

// ============================================================================
// POST-ANALYSIS CARD
// ============================================================================

const PostAnalysisCard = ({ emoji, emojiSize, label, content }) => (
  <div className="summary-glass-card summary-glass-card-outline p-8 md:p-10 space-y-5">
    <div className="summary-glass-glint" />
    <div className="summary-glass-glint-side" />
    <label
      className="text-[9px] font-black tracking-[0.4em] uppercase flex items-center gap-2.5 relative"
      style={{ zIndex: 5, color: label.color }}
    >
      <span className={emojiSize || 'text-xs'}>{emoji}</span> {label.text}
    </label>
    <p className="text-[11px] leading-relaxed text-white/80 font-light relative" style={{ zIndex: 5 }}>
      {content}
    </p>
  </div>
);

// ============================================================================
// MAIN EVALUATION SUMMARY PAGE
// ============================================================================

export default function EvaluationSummaryPage({
  totalScore,
  sacredFoundation,
  structuralWeight,
  vocalCadence,
  postAnalysis,
  evaluator,
  onBack,
  onNewEvaluation,
  onLogoClick,
}) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className="min-h-screen text-white selection:bg-orange-500/30"
      style={{
        fontFamily: "'Space Grotesk', sans-serif",
        background: `radial-gradient(circle at 20% 10%, rgba(255, 69, 0, 0.1) 0%, transparent 40%),
                     radial-gradient(circle at 80% 90%, rgba(139, 0, 139, 0.1) 0%, transparent 40%),
                     #070304`,
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Sticky Header */}
      <header className="sticky top-0 z-[100] border-b border-white/5 backdrop-blur-2xl" style={{ background: 'rgba(7, 3, 4, 0.8)', paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
          <Logo height={28} onClick={onLogoClick} />
          <nav className="flex items-center gap-4 md:gap-8">
            <button
              onClick={onBack}
              className="text-[10px] font-bold tracking-[0.2em] text-white/60 hover:text-white transition-colors uppercase"
              style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }}
            >
              HOME
            </button>
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
              <span className="text-sm">👤</span>
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-20 space-y-12 md:space-y-20">
        {/* Score Circle Section */}
        <section className="flex flex-col items-center text-center space-y-10">
          <div className="space-y-6">
            <h1
              className="text-[10px] md:text-xs font-bold tracking-[0.8em] uppercase"
              style={{ fontFamily: "'JetBrains Mono', monospace", color: '#FF4500' }}
            >
              Evaluation Summary
            </h1>
            <ScoreCircle score={totalScore} />
            {evaluator && evaluator.name && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <span className="text-[8px] uppercase tracking-tighter text-white/30 font-bold">Evaluator:</span>
                {evaluator.type === 'ai' ? (
                  <>
                    <span className="material-symbols-outlined text-[14px]" style={{ color: '#C026D3' }}>smart_toy</span>
                    <span
                      className="text-[13px] font-bold tracking-tight"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        background: 'linear-gradient(90deg, #D12D6F, #C026D3)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {evaluator.name}
                    </span>
                  </>
                ) : (
                  <span
                    className="text-[18px] leading-none"
                    style={{
                      fontFamily: "'League Script', cursive",
                      background: 'linear-gradient(90deg, #D12D6F, #C026D3)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {evaluator.name}
                  </span>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Scores Breakdown */}
        <section className="space-y-8">
          <div className="summary-glass-card summary-glass-card-outline p-8 md:p-14">
            <div className="summary-glass-glint" />
            <div className="summary-glass-glint-side" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative" style={{ zIndex: 5 }}>
              {/* Sacred Foundation */}
              <div className="space-y-8">
                <h3 className="text-[10px] font-black tracking-[0.5em] uppercase border-b border-white/5 pb-4" style={{ color: '#8B008B' }}>
                  Sacred Foundation
                </h3>
                <ul className="space-y-5">
                  <FoundationItem label="Theological Fidelity" checked={sacredFoundation.theological_fidelity} />
                  <FoundationItem label="Exegetical Soundness" checked={sacredFoundation.exegetical_soundness} />
                  <FoundationItem label="Gospel Centrality" checked={sacredFoundation.gospel_centrality} />
                </ul>
              </div>

              {/* Structural Weight */}
              <div className="space-y-8">
                <h3 className="text-[10px] font-black tracking-[0.5em] uppercase border-b border-white/5 pb-4" style={{ color: '#8B008B' }}>
                  Structural Weight
                </h3>
                <div className="space-y-7">
                  <ScoreBar label="Clarity" score={structuralWeight.clarity} />
                  <ScoreBar label="Relevancy" score={structuralWeight.relevancy} />
                  <ScoreBar label="Connectivity" score={structuralWeight.connectivity} />
                  <ScoreBar label="Precision" score={structuralWeight.precision} />
                  <ScoreBar label="Call to Action" score={structuralWeight.call_to_action} />
                </div>
              </div>

              {/* Vocal Cadence */}
              <div className="space-y-8">
                <h3 className="text-[10px] font-black tracking-[0.5em] uppercase border-b border-white/5 pb-4" style={{ color: '#8B008B' }}>
                  Vocal Cadence
                </h3>
                <div className="space-y-7">
                  <ScoreBar label="Relatability" score={vocalCadence.relatability} />
                  <ScoreBar label="Pacing" score={vocalCadence.pacing} />
                  <ScoreBar label="Enthusiasm" score={vocalCadence.enthusiasm} />
                  <ScoreBar label="Charisma" score={vocalCadence.charisma} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Post-Evaluation Analysis */}
        <section className="space-y-8">
          <h3 className="text-[10px] font-black text-center tracking-[0.6em] uppercase text-white/30">
            Post-Evaluation Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <PostAnalysisCard
              emoji="⚡"
              label={{ text: 'Prime Resonance', color: '#FF4500' }}
              content={postAnalysis.anchoring_point || 'No anchoring point recorded.'}
            />
            <PostAnalysisCard
              emoji="📉"
              emojiSize="text-[10px]"
              label={{ text: 'Structural Drift', color: '#D12D6F' }}
              content={postAnalysis.structural_drift || 'No structural drift identified.'}
            />
            <PostAnalysisCard
              emoji="✅"
              emojiSize="text-[10px]"
              label={{ text: 'Measurable Step', color: '#8B008B' }}
              content={postAnalysis.measurable_step || 'No measurable step recorded.'}
            />
          </div>
        </section>

        {/* Start New Evaluation Button */}
        <section className="flex justify-center pt-4">
          <button
            onClick={onNewEvaluation}
            className="summary-btn-gradient text-white px-16 py-6 rounded-full font-black text-[11px] tracking-[0.5em] uppercase transition-all hover:brightness-110 hover:scale-105 active:scale-95"
          >
            Start a New Evaluation
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-12" style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom, 0px))' }}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[8px] md:text-[9px] tracking-[0.8em] text-white/40 uppercase font-black">
            © 2026 THE SCRIBES INC.
          </p>
        </div>
      </footer>

      {/* Scoped styles matching the user's HTML design */}
      <style>{`
        .summary-glass-card {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          position: relative;
          border-radius: 2.5rem;
          overflow: hidden;
          box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.02);
        }
        .summary-glass-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(135deg,
              rgba(255, 255, 255, 0.6) 0%,
              rgba(255, 255, 255, 0.2) 0.5px,
              transparent 1.5px
            ),
            linear-gradient(180deg,
              rgba(255, 255, 255, 0.5) 0px,
              rgba(255, 255, 255, 0.1) 1px,
              transparent 2px
            ),
            linear-gradient(90deg,
              rgba(255, 255, 255, 0.3) 0px,
              rgba(255, 255, 255, 0.05) 1px,
              transparent 1.5px
            );
          pointer-events: none;
          z-index: 3;
        }
        .summary-glass-card-outline::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1.5px;
          background: linear-gradient(135deg, #FF4500 0%, #D12D6F 50%, #8B008B 100%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          opacity: 0.6;
          z-index: 2;
        }
        .summary-glass-glint {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
          z-index: 4;
          pointer-events: none;
        }
        .summary-glass-glint-side {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 1px;
          background: linear-gradient(180deg, transparent, rgba(255,255,255,0.4), transparent);
          z-index: 4;
          pointer-events: none;
        }
        .summary-btn-gradient {
          background: linear-gradient(90deg, #FF4500 0%, #D12D6F 50%, #8B008B 100%);
          box-shadow: 0 10px 40px -10px rgba(255, 69, 0, 0.6);
        }
        .summary-score-bar-gradient {
          background: linear-gradient(90deg, #FF4500 0%, #D12D6F 100%);
        }
        .score-circle-container {
          background: radial-gradient(circle at center, rgba(255, 69, 0, 0.06) 0%, transparent 80%);
        }
        @keyframes summary-coin-spin {
          0% { transform: perspective(1000px) rotateY(0deg); }
          100% { transform: perspective(1000px) rotateY(2880deg); }
        }
        @keyframes summary-reveal-score {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        .summary-coin-spin {
          animation: summary-coin-spin 4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
}
