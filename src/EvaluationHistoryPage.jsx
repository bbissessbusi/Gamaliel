import React, { useEffect, useRef } from 'react';

// ============================================================================
// MOCK EVALUATION DATA
// ============================================================================

const EVALUATIONS = [
  { score: '94.2', title: 'The Path of Fidelity', date: '24 OCT 2025', evaluator: { type: 'ai', name: 'Gamaliel' } },
  { score: '88.5', title: 'Architecture of Grace', date: '12 OCT 2025', evaluator: { type: 'human', name: 'Dr. J. Smith' } },
  { score: '91.0', title: 'Cultural Exegesis', date: '05 OCT 2025', evaluator: { type: 'ai', name: 'Gamaliel' } },
  { score: '76.4', title: 'Ancient Echoes', date: '28 SEP 2025', evaluator: { type: 'human', name: 'Pastor Sarah L.' } },
  { score: '98.1', title: 'Sovereign Silence', date: '21 SEP 2025', evaluator: { type: 'ai', name: 'Gamaliel' } },
  { score: '82.3', title: 'Modern Liturgy', date: '14 SEP 2025', evaluator: { type: 'human', name: 'Dr. J. Smith' } },
  { score: '89.9', title: 'The Great Commission', date: '07 SEP 2025', evaluator: { type: 'ai', name: 'Gamaliel' } },
  { score: '95.5', title: 'Sacred Cadence', date: '31 AUG 2025', evaluator: { type: 'human', name: 'Pastor Sarah L.' } },
  { score: '92.8', title: 'Parabolic Tension', date: '24 AUG 2025', evaluator: { type: 'ai', name: 'Gamaliel' } },
  { score: '87.2', title: 'The Narrow Gate', date: '17 AUG 2025', evaluator: { type: 'human', name: 'Dr. J. Smith' } },
  { score: '79.9', title: 'Shadow & Substance', date: '10 AUG 2025', evaluator: { type: 'ai', name: 'Gamaliel' } },
  { score: '93.4', title: 'Bread of Life', date: '03 AUG 2025', evaluator: { type: 'human', name: 'Pastor Sarah L.' } },
];

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

const EvaluationCard = ({ score, title, date, evaluator }) => (
  <div className="history-glass-slate">
    <span
      className="text-[9px] text-white/40 uppercase tracking-widest mb-4"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      Homiletic Index
    </span>
    <div
      className="text-5xl md:text-6xl tracking-tighter mb-2"
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 800,
        color: 'rgba(255, 255, 255, 0.95)',
        textShadow: '0 0 30px rgba(255, 255, 255, 0.1)',
      }}
    >
      {score}
    </div>
    <div className="mt-auto pt-6 border-t border-white/5 w-full">
      <p className="text-[11px] font-bold text-white mb-0.5">{title}</p>
      <p
        className="text-[9px] text-white/40 uppercase mb-3"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {date}
      </p>
      <div className="flex items-center justify-center gap-1.5 opacity-80">
        <span className="text-[8px] uppercase tracking-tighter text-white/30 font-bold">
          Evaluator:
        </span>
        {evaluator.type === 'ai' ? (
          <>
            <span className="material-symbols-outlined text-[12px]" style={{ color: '#C026D3' }}>
              smart_toy
            </span>
            <span
              className="text-[11px] font-bold tracking-tight"
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
            className="text-[14px] leading-none"
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

export default function EvaluationHistoryPage({ onBack }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className="min-h-screen text-white relative overflow-x-hidden selection:bg-orange-500/30"
      style={{ background: '#000000', fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <WavesCanvas />

      <div className="relative flex flex-col min-h-screen" style={{ zIndex: 10 }}>
        {/* Header */}
        <header className="pt-8 pb-12 px-6 relative">
          <div className="max-w-7xl mx-auto relative flex flex-col items-center">
            <div className="w-full flex justify-end mb-12">
              <button onClick={onBack} className="history-back-btn group">
                <span className="text-[12px] transition-transform group-hover:-translate-x-1">
                  {'\u2B05\uFE0F'}
                </span>
                BACK TO DASHBOARD
              </button>
            </div>
            <div className="text-center">
              <h1 className="history-robotic-header text-3xl md:text-6xl mb-4">
                EVALUATION HISTORY
              </h1>
              <p
                className="text-white/40 text-[10px] md:text-[12px] tracking-[0.8em] uppercase"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                INTERNAL AUDIT
              </p>
            </div>
          </div>
        </header>

        {/* Evaluation Cards Grid */}
        <main className="max-w-7xl mx-auto px-6 pb-24 flex-grow w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {EVALUATIONS.map((evaluation, index) => (
              <EvaluationCard key={index} {...evaluation} />
            ))}
          </div>
        </main>
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
          padding: 1.5rem;
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
        .history-glass-slate:hover {
          transform: translateY(-8px) scale(1.02);
          background: rgba(255, 255, 255, 0.07);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4), inset 0 0 20px rgba(255,255,255,0.05);
        }
        .history-glass-slate:active {
          transform: translateY(2px) scale(0.96);
          background: rgba(255, 255, 255, 0.02);
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
          letter-spacing: 0.4em;
          background: linear-gradient(to bottom, #FF4500 20%, #D12D6F 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 20px rgba(255, 69, 0, 0.2));
        }
        .history-back-btn {
          padding: 10px 20px;
          border-radius: 9999px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
          font-family: 'JetBrains Mono', monospace;
          color: white;
          cursor: pointer;
        }
        .history-back-btn:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
