import React, { useEffect, useRef } from 'react';
import Logo from './components/Logo';

// ============================================================================
// SINGLE MOCK CARD (placeholder when no real data exists)
// ============================================================================

const MOCK_EVALUATION = {
  score: '82.5',
  title: 'Sample Evaluation',
  date: '01 JAN 2026',
  evaluator: { type: 'ai', name: 'Gamaliel' },
  isMock: true,
};

// ============================================================================
// WAVE CANVAS BACKGROUND
// ============================================================================

const WavesCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width, height;
    let mouse = { x: -2000, y: -2000 };
    let lastMoveTime = 0;
    const waves = [];
    const waveCount = 15;
    let animationId;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function init() {
      resize();
      for (let i = 0; i < waveCount; i++) {
        waves.push({
          y: height / 2,
          length: 0.0008 + (i * 0.0004),
          amplitude: 50 + (i * 15),
          frequency: 0.01 + (i * 0.002),
          phase: i * (Math.PI / waveCount),
          opacity: 0.15 + (i / waveCount) * 0.4,
        });
      }
    }

    function animate() {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);
      const timeSinceMove = Date.now() - lastMoveTime;
      const interactionFactor = Math.max(0, 1 - timeSinceMove / 2000);

      waves.forEach((wave) => {
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        for (let x = 0; x < width; x++) {
          const distToMouse = Math.abs(x - mouse.x);
          const mouseInfluence = Math.max(0, 1 - distToMouse / 600);
          const sine = Math.sin(x * wave.length + wave.phase);
          const noise = Math.sin(x * wave.length * 2.5 + wave.phase * 0.5) * 0.4;
          const currentAmplitude = wave.amplitude * (0.02 + interactionFactor * 1.5 + mouseInfluence * 0.5);
          const y = height / 2 + (sine + noise) * currentAmplitude;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(255, 255, 255, ${wave.opacity * (0.3 + interactionFactor * 0.7)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        if (interactionFactor > 0) {
          wave.phase += wave.frequency * interactionFactor;
        }
      });
      animationId = requestAnimationFrame(animate);
    }

    const handleResize = () => {
      resize();
      waves.forEach((w) => (w.y = height / 2));
    };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      lastMoveTime = Date.now();
    };
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        lastMoveTime = Date.now();
      }
    };

    init();
    animationId = requestAnimationFrame(animate);
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

// ============================================================================
// EVALUATION CARD
// ============================================================================

const EvaluationCard = ({ score, title, date, evaluator, isMock }) => (
  <div className={`history-glass-slate ${isMock ? 'opacity-60' : ''}`}>
    {isMock && (
      <span className="text-[7px] text-white/30 uppercase tracking-widest mb-2 font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        Sample Card
      </span>
    )}
    <span
      className="text-[9px] text-white/40 uppercase tracking-widest mb-4"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      Homiletic Index
    </span>
    <div
      className="text-4xl sm:text-5xl md:text-6xl tracking-tighter mb-2"
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 800,
        color: 'rgba(255, 255, 255, 0.95)',
        textShadow: '0 0 30px rgba(255, 255, 255, 0.1)',
      }}
    >
      {score}
    </div>
    <div className="mt-auto pt-4 md:pt-6 border-t border-white/5 w-full">
      <p className="text-[10px] md:text-[11px] font-bold text-white mb-0.5">{title}</p>
      <p
        className="text-[8px] md:text-[9px] text-white/40 uppercase mb-3"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {date}
      </p>
      <div className="flex items-center justify-center gap-1.5 opacity-80">
        <span className="text-[7px] md:text-[8px] uppercase tracking-tighter text-white/30 font-bold">
          Evaluator:
        </span>
        {evaluator.type === 'ai' ? (
          <>
            <span className="material-symbols-outlined text-[12px]" style={{ color: '#C026D3' }}>
              smart_toy
            </span>
            <span
              className="text-[10px] md:text-[11px] font-bold tracking-tight"
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
            className="text-[13px] md:text-[14px] leading-none"
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
    </div>
  </div>
);

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function EvaluationHistoryPage({ evaluations: supabaseEvals, onBack }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Build display list: real Supabase data OR 1 mock card as fallback
  const displayEvaluations = (supabaseEvals && supabaseEvals.length > 0)
    ? supabaseEvals.map((ev) => ({
        score: String(ev.total_score),
        title: ev.sermon_title,
        date: new Date(ev.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
        evaluator: { type: ev.evaluator_type, name: ev.evaluator_name },
      }))
    : [MOCK_EVALUATION];

  return (
    <div
      className="min-h-screen text-white relative overflow-x-hidden selection:bg-orange-500/30"
      style={{ background: '#000000', fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <WavesCanvas />

      <div className="relative flex flex-col min-h-screen" style={{ zIndex: 10 }}>
        {/* Header with Logo and Back */}
        <header className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-2xl" style={{ background: 'rgba(0, 0, 0, 0.8)', paddingTop: 'env(safe-area-inset-top, 0px)' }}>
          <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
            <Logo height={28} />
            <button onClick={onBack} className="history-back-btn group">
              <span className="text-[16px] transition-transform group-hover:-translate-x-1">⬅️</span>
            </button>
          </div>
        </header>

        {/* Title Section */}
        <div className="pt-8 md:pt-12 pb-8 md:pb-12 px-4 md:px-6 relative">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="history-robotic-header text-2xl sm:text-3xl md:text-6xl mb-3 md:mb-4">
              EVALUATION HISTORY
            </h1>
            <p
              className="text-white/40 text-[9px] md:text-[12px] tracking-[0.5em] md:tracking-[0.8em] uppercase"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              INTERNAL AUDIT
            </p>
          </div>
        </div>

        {/* Evaluation Cards Grid */}
        <main className="max-w-7xl mx-auto px-4 md:px-6 pb-16 md:pb-24 flex-grow w-full">
          {displayEvaluations.length === 1 && displayEvaluations[0].isMock && (
            <p className="text-center text-white/30 text-[10px] uppercase tracking-widest mb-6" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Complete your first evaluation to see it here
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayEvaluations.map((evaluation, index) => (
              <EvaluationCard key={index} {...evaluation} />
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/5 py-8" style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom, 0px))' }}>
          <div className="text-center">
            <p className="text-[8px] tracking-[0.5em] text-white/40 uppercase font-black">
              © 2026 SCRIBE INC.
            </p>
          </div>
        </footer>
      </div>

      {/* Scoped styles */}
      <style>{`
        .history-glass-slate {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 1.25rem;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 0.75rem;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                      background 0.3s ease,
                      box-shadow 0.3s ease;
          cursor: pointer;
        }
        @media (min-width: 640px) {
          .history-glass-slate {
            padding: 1.5rem;
          }
        }
        .history-glass-slate:hover {
          transform: translateY(-8px) scale(1.02);
          background: rgba(255, 255, 255, 0.07);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4), inset 0 0 20px rgba(255,255,255,0.05);
        }
        @media (hover: none) {
          .history-glass-slate:hover {
            transform: none;
          }
          .history-glass-slate:active {
            transform: scale(0.97);
            background: rgba(255, 255, 255, 0.02);
          }
        }
        .history-glass-slate::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
        }
        .history-robotic-header {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          background: linear-gradient(to bottom, #FF4500 20%, #D12D6F 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 20px rgba(255, 69, 0, 0.2));
        }
        @media (min-width: 768px) {
          .history-robotic-header {
            letter-spacing: 0.4em;
          }
        }
        .history-back-btn {
          padding: 10px 16px;
          border-radius: 9999px;
          font-size: 10px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
          font-family: 'JetBrains Mono', monospace;
          color: white;
          cursor: pointer;
          min-width: 44px;
          min-height: 44px;
          justify-content: center;
        }
        .history-back-btn:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
