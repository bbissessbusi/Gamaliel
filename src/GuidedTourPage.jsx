import React, { useState, useEffect } from 'react';

// ============================================================================
// DISCOVERY TOOLTIP COMPONENT
// ============================================================================

const DiscoveryTooltip = ({ isOpen, onClose, title, children, position = 'top' }) => (
  <>
    {/* Spotlight overlay */}
    {isOpen && (
      <div
        className="fixed inset-0 z-[250] cursor-pointer"
        style={{ background: 'rgba(0, 0, 0, 0.85)' }}
        onClick={onClose}
      />
    )}

    {/* Tooltip card */}
    <div
      className={`absolute z-[400] w-[300px] md:w-[340px] p-6 overflow-hidden ${
        position === 'top' ? '-top-36' : '-bottom-36'
      } ${position === 'top' ? 'left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:-right-4' : 'left-1/2 -translate-x-1/2'}`}
      style={{
        background: 'rgba(10, 10, 10, 0.15)',
        backdropFilter: 'blur(30px) saturate(160%)',
        WebkitBackdropFilter: 'blur(30px) saturate(160%)',
        borderRadius: '1.5rem',
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
        transform: isOpen ? 'translateY(0)' : 'translateY(15px)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Gradient border */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: 'inherit',
          padding: '1px',
          background: 'linear-gradient(135deg, #FF4500, #D12D6F, #8B008B)',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
        }}
      />
      {/* Specular highlight */}
      <div className="absolute inset-0 pointer-events-none z-30" style={{ borderRadius: 'inherit' }}>
        <div
          className="absolute top-0 left-[10%] right-[10%] h-[1px]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.1), transparent)',
            filter: 'blur(0.2px)',
          }}
        />
      </div>
      <div className="flex flex-col gap-4 relative z-40">
        <div className="flex items-center justify-between">
          <span
            className="font-black text-[10px] tracking-[0.3em] uppercase"
            style={{ fontFamily: "'JetBrains Mono', monospace", color: '#FF4500' }}
          >
            Discovery Phase
          </span>
          <button onClick={onClose} className="cursor-pointer text-white/40 hover:text-white">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
        <h5
          className="text-xs font-black tracking-widest uppercase"
          style={{ fontFamily: "'JetBrains Mono', monospace", color: '#FF4500' }}
        >
          {title}
        </h5>
        <p className="text-[11px] font-light leading-relaxed text-white">
          {children}
        </p>
        <div className="flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 text-[9px] font-black tracking-widest text-white uppercase cursor-pointer transition-all active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #8B008B 0%, #4B0082 100%)',
              borderRadius: '0.75rem',
            }}
          >
            GOT IT
          </button>
        </div>
      </div>
    </div>
  </>
);

// ============================================================================
// GLASS CARD (TOUR VERSION)
// ============================================================================

const TourGlassCard = ({ children, className = '', onClick }) => (
  <div
    className={`tour-glass-card tour-glass-card-outline ${className}`}
    onClick={onClick}
    style={{ cursor: onClick ? 'pointer' : 'default' }}
  >
    {/* Specular highlight */}
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
// MAIN GUIDED TOUR PAGE
// ============================================================================

export default function GuidedTourPage({ onBack, onSkip }) {
  const [activeTooltip, setActiveTooltip] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const openTooltip = (id) => setActiveTooltip(id);
  const closeTooltip = () => setActiveTooltip(null);

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
      <header className="sticky top-0 z-[100] border-b border-white/5 backdrop-blur-2xl" style={{ background: 'rgba(7, 3, 4, 0.8)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3 text-white">
            <div className="flex items-center gap-1.5">
              <span className="text-xl md:text-3xl font-serif italic font-bold">SI</span>
              <div className="h-4 md:h-6 w-px bg-white/20 mx-1 md:mx-2" />
              <span className="text-[8px] md:text-xs font-black tracking-[0.4em] uppercase">Scribe Inc.</span>
            </div>
          </div>
          <nav className="flex items-center gap-4 md:gap-8">
            <button
              onClick={onSkip || onBack}
              className="bg-white/5 border border-white/10 text-white px-4 md:px-6 py-2 rounded-lg md:rounded-xl font-bold text-[8px] md:text-[10px] tracking-[0.2em] transition-all hover:bg-white/10 uppercase"
            >
              SKIP TOUR
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-16 space-y-12 md:space-y-20 relative">
        {/* Hero Section */}
        <section className="space-y-8 md:space-y-12">
          <div className="max-w-3xl">
            <h2
              className="text-[2.5rem] sm:text-6xl md:text-7xl font-black leading-[1.1] md:leading-[1] tracking-tighter uppercase mb-4 md:mb-6"
              style={{
                background: 'linear-gradient(90deg, #FF4500 0%, #D12D6F 50%, #8B008B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              HOMILETICS<br />
              <span style={{ color: '#FF4500', WebkitTextFillColor: '#FF4500' }}>SCORECARD</span>
            </h2>
            <p className="text-white/80 text-sm sm:text-base md:text-lg font-light leading-relaxed tracking-wide">
              Premium digital analysis of sermon weight, structure, and delivery. Designed for intentional preachers.
            </p>
          </div>

          {/* Sermon Info Fields */}
          <TourGlassCard className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="flex flex-col gap-3 relative z-40">
              <label className="text-[9px] font-black text-white tracking-[0.4em] uppercase flex items-center gap-2">
                <span className="text-[12px]">📖</span> Sermon Title/Text
              </label>
              <input
                className="bg-white/5 border border-white/10 rounded-xl p-3.5 focus:outline-none focus:ring-1 focus:ring-orange-500/50 text-white placeholder:text-white/40 transition-all text-sm"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                placeholder="e.g. Romans 8:1-4"
                type="text"
                readOnly
              />
            </div>
            <div className="flex flex-col gap-3 relative z-40">
              <label className="text-[9px] font-black text-white tracking-[0.4em] uppercase flex items-center gap-2">
                <span className="text-[12px]">📅</span> Preach Date
              </label>
              <input
                className="bg-white/5 border border-white/10 rounded-xl p-3.5 focus:outline-none focus:ring-1 focus:ring-orange-500/50 text-white [color-scheme:dark] transition-all text-sm"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                type="date"
                readOnly
              />
            </div>
            <div className="flex flex-col gap-3 relative z-40">
              <label className="text-[9px] font-black text-white tracking-[0.4em] uppercase flex items-center gap-2">
                <span className="text-[12px]">🎯</span> Primary Goal
              </label>
              <input
                className="bg-white/5 border border-white/10 rounded-xl p-3.5 focus:outline-none focus:ring-1 focus:ring-orange-500/50 text-white placeholder:text-white/40 transition-all text-sm"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                placeholder="The core objective"
                type="text"
                readOnly
              />
            </div>
          </TourGlassCard>
        </section>

        {/* Digital Capture Section */}
        <section className="space-y-6 relative">
          <div className="flex items-center gap-4">
            <span className="text-xl">📹</span>
            <h3
              className="text-lg md:text-xl font-black uppercase tracking-widest italic"
              style={{
                background: 'linear-gradient(90deg, #FF4500 0%, #D12D6F 50%, #8B008B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Digital Capture
            </h3>
          </div>

          <div onClick={() => openTooltip('capture')}>
            <TourGlassCard className="p-6 md:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-10">
              <div className="flex flex-col gap-3 relative z-40 w-full lg:w-auto">
                <h4
                  className="text-base md:text-lg font-bold tracking-tight uppercase"
                  style={{
                    background: 'linear-gradient(90deg, #FF4500 0%, #D12D6F 50%, #8B008B 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Sermon Recording
                </h4>
                <p className="text-[10px] md:text-xs text-white max-w-sm leading-relaxed">
                  Analyze the rhythm of the spoken word in real-time through high-fidelity capture.
                </p>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 relative z-40 w-full lg:w-auto">
                <div className="flex items-center gap-4 bg-white/5 rounded-2xl px-5 py-3 border border-white/5 w-full md:w-auto">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-bold text-[#39ff14] uppercase tracking-[0.3em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      🤖 Gamaliel AI Assistant
                    </span>
                    <span className="text-white text-[10px] font-bold uppercase tracking-widest mt-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      Start AI Analysis
                    </span>
                  </div>
                  <div className="ml-auto md:ml-0 w-2 h-2 rounded-full bg-[#39ff14]" />
                </div>
                <div className="flex items-center gap-4">
                  <button className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-orange-500/30 flex items-center justify-center">
                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#FF4500]" style={{ boxShadow: '0 0 15px #FF4500' }} />
                  </button>
                </div>
              </div>
            </TourGlassCard>
          </div>

          <DiscoveryTooltip isOpen={activeTooltip === 'capture'} onClose={closeTooltip} title="Digital Capture">
            Capture your message here. <span className="text-[#FF4500] font-bold">Gamaliel AI</span> will listen in real-time to analyze your rhythm and delivery.
          </DiscoveryTooltip>
        </section>

        {/* Sacred Foundation Section */}
        <section className="space-y-6 relative">
          <div className="flex items-center gap-4">
            <span className="font-black text-xl italic">1️⃣</span>
            <h3
              className="text-lg md:text-xl font-black uppercase tracking-widest italic"
              style={{
                background: 'linear-gradient(90deg, #FF4500 0%, #D12D6F 50%, #8B008B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Sacred Foundation
            </h3>
          </div>

          <div onClick={() => openTooltip('foundation')}>
            <TourGlassCard className="p-6 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 relative z-40">
                {['Theological Fidelity', 'Exegetical Soundness', 'Gospel Centrality'].map((label) => (
                  <div key={label} className="flex items-center gap-4">
                    <div className="w-6 h-6 border border-white/20 rounded-lg bg-black/40" />
                    <span className="font-bold text-white text-sm tracking-tight uppercase">{label}</span>
                  </div>
                ))}
              </div>
            </TourGlassCard>
          </div>

          <DiscoveryTooltip isOpen={activeTooltip === 'foundation'} onClose={closeTooltip} title="Sacred Foundation">
            Non-negotiable markers for every sermon. Check these to affirm theological and <span className="text-[#FF4500] font-bold">gospel centrality</span>.
          </DiscoveryTooltip>
        </section>

        {/* Spectrum Sliders Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 relative">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="font-black text-xl italic">2️⃣</span>
              <h3
                className="text-base md:text-lg font-black uppercase tracking-widest italic"
                style={{
                  background: 'linear-gradient(90deg, #FF4500 0%, #D12D6F 50%, #8B008B 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Structural Weight
              </h3>
            </div>
            <div onClick={() => openTooltip('spectrum')}>
              <TourGlassCard className="p-6 md:p-12 space-y-8 h-full">
                <div className="space-y-4 relative z-40">
                  <div className="flex justify-between items-end">
                    <label className="font-bold text-[10px] uppercase tracking-[0.2em] text-white">Relevancy</label>
                    <span className="text-[10px] font-black text-[#FF4500]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>08</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full relative">
                    <div className="absolute left-0 top-0 h-full bg-[#FF4500] rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>
              </TourGlassCard>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="font-black text-xl italic">3️⃣</span>
              <h3
                className="text-base md:text-lg font-black uppercase tracking-widest italic"
                style={{
                  background: 'linear-gradient(90deg, #FF4500 0%, #D12D6F 50%, #8B008B 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Vocal Cadence
              </h3>
            </div>
            <div onClick={() => openTooltip('spectrum')}>
              <TourGlassCard className="p-6 md:p-12 space-y-8 h-full">
                <div className="space-y-4 relative z-40">
                  <div className="flex justify-between items-end">
                    <label className="font-bold text-[10px] uppercase tracking-[0.2em] text-white">Pacing</label>
                    <span className="text-[10px] font-black text-[#FF4500]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>07</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full relative">
                    <div className="absolute left-0 top-0 h-full bg-[#FF4500] rounded-full" style={{ width: '70%' }} />
                  </div>
                </div>
              </TourGlassCard>
            </div>
          </div>

          <DiscoveryTooltip isOpen={activeTooltip === 'spectrum'} onClose={closeTooltip} title="Spectrum Sliders" position="top">
            Rate your <span className="text-[#FF4500] font-bold">structural weight</span> and vocal cadence. Watch the colors shift as you move from good to exceptional.
          </DiscoveryTooltip>
        </section>

        {/* Calculate Score Section */}
        <section className="pt-8 md:pt-12 pb-8 relative flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16">
          <div onClick={() => openTooltip('calculate')} className="w-full md:w-auto z-[260]">
            <button
              className="text-white w-full md:w-auto px-10 md:px-12 py-4 md:py-5 rounded-2xl md:rounded-3xl font-black text-xs md:text-sm tracking-[0.4em] uppercase transition-all active:scale-95"
              style={{
                background: 'linear-gradient(90deg, #FF4500 0%, #8B008B 100%)',
                boxShadow: '0 15px 40px -10px rgba(255, 69, 0, 0.5)',
              }}
            >
              CALCULATE SCORE
            </button>
          </div>

          <div className="flex items-center gap-6 md:gap-8">
            <div
              className="tour-glass-card tour-glass-card-outline w-28 h-28 md:w-32 md:h-32 rounded-full flex flex-col items-center justify-center relative"
            >
              <div className="absolute inset-0 pointer-events-none z-30" style={{ borderRadius: 'inherit' }}>
                <div
                  className="absolute top-0 left-[10%] right-[10%] h-[1px]"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), rgba(255,255,255,0.6), rgba(255,255,255,0.1), transparent)',
                  }}
                />
              </div>
              <span
                className="text-[8px] md:text-[9px] font-black tracking-tighter uppercase mb-0.5 relative z-40"
                style={{
                  background: 'linear-gradient(90deg, #FF4500 0%, #D12D6F 50%, #8B008B 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                INDEX
              </span>
              <span className="text-2xl md:text-3xl font-black text-white relative z-40" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                0/90
              </span>
            </div>
            <div className="max-w-[120px] md:max-w-[140px]">
              <p className="text-[8px] md:text-[9px] text-white uppercase font-black tracking-[0.2em] md:tracking-[0.3em] leading-relaxed">
                Composite Homiletics Index (CHI)
              </p>
            </div>
          </div>

          <DiscoveryTooltip isOpen={activeTooltip === 'calculate'} onClose={closeTooltip} title="Finalize Metrics" position="top">
            Finalize your evaluation. This triggers the weighted algorithm to generate your <span className="text-[#FF4500] font-bold">Composite Homiletics Index (CHI)</span> based on all measured metrics.
          </DiscoveryTooltip>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[8px] md:text-[9px] tracking-[0.5em] text-white/40 uppercase font-black">
            © 2026 SCRIBE INC.
          </p>
        </div>
      </footer>

      {/* Floating banner */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[150] pointer-events-none text-center">
        <span
          className="text-white text-[9px] font-black tracking-[0.3em] px-4 py-2 rounded-full uppercase"
          style={{
            background: 'rgba(255, 69, 0, 0.2)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 69, 0, 0.3)',
          }}
        >
          Click sections to explore features
        </span>
      </div>

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
          cursor: pointer;
        }
        @media (min-width: 768px) {
          .tour-glass-card {
            border-radius: 3.5rem;
          }
        }
        .tour-glass-card:active {
          transform: scale(0.99) translateZ(-10px);
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
        .tour-glass-card:hover::after {
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}
