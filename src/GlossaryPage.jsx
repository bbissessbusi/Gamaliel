import React, { useEffect, useRef } from 'react';

// ============================================================================
// WAVE CANVAS BACKGROUND
// ============================================================================

const WavesCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width, height;
    let mouse = { x: -1000, y: -1000 };
    let lastMoveTime = 0;
    const waves = [];
    const waveCount = 20;
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
          length: 0.001 + (i * 0.0005),
          amplitude: 80 + (i * 12),
          frequency: 0.008 + (i * 0.0015),
          phase: i * (Math.PI / waveCount),
          opacity: 0.25 + (i / waveCount) * 0.45
        });
      }
    }

    function animate() {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);
      const timeSinceMove = Date.now() - lastMoveTime;
      const interactionDecay = Math.max(0, 1 - timeSinceMove / 1500);

      waves.forEach((wave) => {
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        for (let x = 0; x < width; x++) {
          const mouseDistance = Math.abs(x - mouse.x);
          const influenceRange = 500;
          const proximityFactor = Math.max(0, 1 - mouseDistance / influenceRange);
          const combinedInfluence = proximityFactor * interactionDecay;
          const sine1 = Math.sin(x * wave.length + wave.phase);
          const sine2 = Math.sin(x * wave.length * 2.1 + wave.phase * 0.3) * 0.3;
          const activeAmplitude = wave.amplitude * (0.05 + (combinedInfluence * 2.5));
          const yOffset = (sine1 + sine2) * activeAmplitude;
          const y = height / 2 + yOffset;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(255, 255, 255, ${wave.opacity * (0.4 + interactionDecay * 0.6)})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        if (interactionDecay > 0) {
          wave.phase += wave.frequency * interactionDecay;
        }
      });
      animationId = requestAnimationFrame(animate);
    }

    const handleResize = () => {
      resize();
      waves.forEach(w => w.y = height / 2);
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
        opacity: 1,
      }}
    />
  );
};

// ============================================================================
// GLOSSARY TERM CARD
// ============================================================================

const GlossaryCard = ({ id, title, etymology, application }) => (
  <div id={id} className="glossary-glass-card glossary-glass-card-outline p-8">
    <div className="glossary-linear-specular"></div>
    <div className="relative" style={{ zIndex: 40 }}>
      <h3 className="text-base font-robot font-bold text-white mb-5 uppercase tracking-widest transition-all duration-300">{title}</h3>
      <div className="text-white text-[12px] leading-[1.6] font-light">
        <p className="italic text-white/60 mb-3 text-[10px] uppercase tracking-wider">{etymology}</p>
        <div className="space-y-3">
          <div>
            <span className="text-white/50 font-robot text-[9px] uppercase tracking-widest font-bold block mb-1">Application</span>
            <p>{application}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ============================================================================
// SECTION DIVIDER
// ============================================================================

const SectionDivider = ({ number, title }) => (
  <div className="flex items-center gap-8">
    <h2 className="text-[11px] font-black font-robot tracking-[0.5em] uppercase text-reddish-purple shrink-0 drop-shadow-sm">
      {number}. {title}
    </h2>
    <span className="h-px flex-1 bg-gradient-to-r from-reddish-purple/60 via-reddish-purple/20 to-transparent"></span>
  </div>
);

// ============================================================================
// MAIN GLOSSARY PAGE
// ============================================================================

export default function GlossaryPage({ scrollToTerm, onBack }) {
  useEffect(() => {
    if (scrollToTerm) {
      const timer = setTimeout(() => {
        const element = document.getElementById(scrollToTerm);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('glossary-highlight');
          setTimeout(() => element.classList.remove('glossary-highlight'), 2000);
        }
      }, 300);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo(0, 0);
    }
  }, [scrollToTerm]);

  return (
    <div
      className="min-h-screen text-white relative overflow-x-hidden selection:bg-reddish-purple/30"
      style={{ background: '#000000', fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <WavesCanvas />

      <div className="relative flex flex-col min-h-screen" style={{ zIndex: 10 }}>
        {/* Header */}
        <header className="py-20 md:py-32 text-center px-4 max-w-4xl mx-auto">
          {/* Back navigation */}
          <button
            onClick={onBack}
            className="text-[10px] font-bold tracking-[0.2em] text-white/60 hover:text-white transition-colors uppercase mb-8 inline-block"
          >
            ⬅️
          </button>
          <h1
            className="text-5xl md:text-7xl font-robot font-black uppercase mb-6"
            style={{
              letterSpacing: '0.25em',
              background: 'linear-gradient(to bottom, #FF4500 0%, #D12D6F 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Refined Lexicon
          </h1>
          <p className="text-white/60 text-xs md:text-sm font-medium tracking-[0.1em] max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
            The authoritative glossary of Homiletic Excellence for Scribe Inc. Each term defines a critical dimension of the Sacred Scorecard.
          </p>
        </header>

        <main className="max-w-7xl mx-auto px-6 space-y-24 flex-grow mb-32">
          {/* I. The Sacred Foundation */}
          <section className="space-y-10">
            <SectionDivider number="I" title="The Sacred Foundation" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlossaryCard
                id="fidelity"
                title="Fidelity"
                etymology="Lat. Fidelitas — Faithfulness"
                application="Measures the sermon's unwavering loyalty to the unchanging truth of the Christian faith."
              />
              <GlossaryCard
                id="exegesis"
                title="Exegesis"
                etymology="Gr. Ex&#x113;geisthai — To lead out"
                application="The preacher's discipline in leading out the inherent meaning from the biblical text, resisting eisegesis."
              />
              <GlossaryCard
                id="gospel-centrality"
                title="Gospel Centrality"
                etymology="The Christological Lens"
                application="Ensures the person and work of Jesus Christ is central and unmistakable in the message, never an afterthought."
              />
            </div>
          </section>

          {/* II. Message Architecture */}
          <section className="space-y-10">
            <SectionDivider number="II" title="Message Architecture" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <GlossaryCard
                id="relevancy"
                title="Relevancy"
                etymology="Lat. Relevare — To lift up"
                application="Effectively 'lifting up' the ancient text for the modern world, bridging the cultural gap."
              />
              <GlossaryCard
                id="clarity"
                title="Clarity"
                etymology="Lat. Clarus — Bright, distinct"
                application="The luminosity of the sermon's core idea. A single, sharp point that can be easily recalled."
              />
              <GlossaryCard
                id="connectivity"
                title="Connectivity"
                etymology="Lat. Connectere — To bind"
                application="The structural integrity of the message; the strength of ligaments binding individual points."
              />
              <GlossaryCard
                id="precision"
                title="Precision"
                etymology="Lat. Praecisio — A cutting short"
                application="Surgical use of language where every word is intentional, eliminating excess to maximize clarity and impact."
              />
              <GlossaryCard
                id="call-to-action"
                title="Call to Action"
                etymology="The Imperative Response"
                application="The sermon's clear, compelling invitation for listeners to respond — a defined next step that transforms hearing into doing."
              />
            </div>
          </section>

          {/* III. Delivery & Connection */}
          <section className="space-y-10">
            <SectionDivider number="III" title="Delivery &amp; Connection" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <GlossaryCard
                id="relatability"
                title="Relatability"
                etymology="Lat. Relatus — Bring back"
                application="Bringing the message to common human ground where the listener feels seen."
              />
              <GlossaryCard
                id="cadence"
                title="Cadence"
                etymology="Lat. Cadentia — A falling"
                application="The musicality and rhythmic rise and fall of the preacher's voice."
              />
              <GlossaryCard
                id="pacing"
                title="Pacing"
                etymology="Lat. Passus — A step"
                application="The deliberate control of delivery speed, strategic pauses, and rhythmic variation that gives weight to key moments."
              />
              <GlossaryCard
                id="enthusiasm"
                title="Enthusiasm"
                etymology="Gr. Enthousiasmos — Inspired"
                application="Evidence that the preacher is genuinely moved by the truth of the message."
              />
              <GlossaryCard
                id="charisma"
                title="Charisma"
                etymology="Gr. Kharisma — Gift of grace"
                application="The divine gift of commanding attention and building rapport with an audience."
              />
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="w-full py-8 mt-auto border-t border-white/5">
          <div className="w-full px-6 text-center">
            <p className="text-[8px] tracking-[0.5em] text-white/40 uppercase font-black">
              © 2026 SCRIBE INC.
            </p>
          </div>
        </footer>
      </div>

      {/* Glossary-specific styles */}
      <style>{`
        .glossary-glass-card {
          position: relative;
          overflow: hidden;
          height: 100%;
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(20px) saturate(160%);
          -webkit-backdrop-filter: blur(20px) saturate(160%);
          border-radius: 1.5rem;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .glossary-glass-card:hover {
          transform: translateY(-4px);
          background: rgba(255, 255, 255, 0.08);
        }
        .glossary-glass-card-outline {
          position: relative;
        }
        .glossary-glass-card-outline::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1.5px;
          background: linear-gradient(135deg, #FF4500 0%, #D12D6F 50%, #C026D3 100%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          opacity: 0.6;
          z-index: 20;
        }
        .glossary-linear-specular {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 30;
          border-radius: inherit;
        }
        .glossary-linear-specular::before {
          content: "";
          position: absolute;
          top: 0; left: 10%; right: 10%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.05), transparent);
          filter: blur(0.5px);
        }
        .glossary-highlight {
          animation: glossary-highlight-pulse 2s ease-out;
        }
        @keyframes glossary-highlight-pulse {
          0% { box-shadow: 0 0 0 4px rgba(255, 69, 0, 0.7), 0 0 30px rgba(255, 69, 0, 0.3); }
          100% { box-shadow: 0 0 0 0px rgba(255, 69, 0, 0), 0 0 0px rgba(255, 69, 0, 0); }
        }
      `}</style>
    </div>
  );
}
