import React, { useState, useEffect } from 'react';

// Gradient text style helper - ensures cross-browser compatibility
const gradientTextStyle = {
  background: 'linear-gradient(to right, #FF4500, #D12D6F, #8B008B)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

// Color interpolation function for sliders
const getSliderColor = (value) => {
  const r = Math.round(255 - (value * (255 - 139) / 10));
  const g = Math.round(69 - (value * 69 / 10));
  const b = Math.round(0 + (value * 139 / 10));
  return `rgb(${r}, ${g}, ${b})`;
};

// Spectrum Slider Component
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
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${color} ${percentage}%, rgba(255, 255, 255, 0.1) ${percentage}%)`,
          '--thumb-color': color
        }}
      />
    </div>
  );
};

// Checkbox Item Component
const CheckboxItem = ({ label, subtitle, checked, onToggle }) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <div
      className={`relative flex-shrink-0 w-6 h-6 border rounded-lg flex items-center justify-center transition-all ${ checked ? 'border-transparent bg-transparent' : 'border-white/20 bg-black/40 group-hover:border-orange-500/50' }`}
      onClick={onToggle}
    >
      {checked && <span className="text-xl">✅</span>}
    </div>
    <div className="flex flex-col">
      <span className="font-bold text-white text-xs tracking-tight uppercase">{label}</span>
      <span className="text-[8px] text-white/70 uppercase font-bold tracking-widest">{subtitle}</span>
    </div>
  </label>
);

// Glass Card Component with proper reflective effects
const GlassCard = ({ children, className = '', rounded = '2xl' }) => (
  <div className={`relative overflow-hidden ${rounded === 'full' ? 'rounded-full' : 'rounded-2xl'} ${className}`} style={{
    background: 'rgba(255, 255, 255, 0.025)',
    backdropFilter: 'blur(16px) saturate(180%)',
  }}>
    {/* Gradient border */}
    <div className={`absolute inset-0 ${rounded === 'full' ? 'rounded-full' : 'rounded-2xl'} pointer-events-none`} style={{
      padding: '1px',
      background: 'linear-gradient(135deg, #FF4500, #D12D6F, #8B008B)',
      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      maskComposite: 'exclude',
      WebkitMaskComposite: 'xor',
      opacity: 0.5
    }} />
    {/* Top specular highlight */}
    <div className="absolute top-0 left-[10%] right-[10%] h-[1px] pointer-events-none z-10" style={{
      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.1), transparent)'
    }} />
    {/* Left edge specular highlight */}
    <div className="absolute top-[5%] left-0 bottom-[30%] w-[1px] pointer-events-none z-10" style={{
      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.3), transparent)'
    }} />
    <div className="relative z-10">{children}</div>
  </div>
);

// AI Pulsing Indicator
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
      className="w-2 h-2 rounded-full bg-[#39ff14] transition-transform duration-1000"
      style={{
        transform: `scale(${scale})`,
        boxShadow: '0 0 15px rgba(57, 255, 20, 0.6)'
      }}
    />
  );
};

// Gradient Button with reflective effect
const GradientButton = ({ children, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`relative overflow-hidden text-white px-8 py-4 rounded-2xl font-black text-xs tracking-[0.3em] uppercase transition-all hover:scale-105 active:scale-95 ${className}`}
    style={{
      background: 'linear-gradient(90deg, #FF4500 0%, #8B008B 100%)',
      boxShadow: '0 10px 30px -10px rgba(255, 69, 0, 0.5)'
    }}
  >
    {/* Top specular highlight */}
    <div className="absolute top-0 left-[10%] right-[10%] h-[1px] pointer-events-none" style={{
      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.2), transparent)'
    }} />
    {children}
  </button>
);

// Section Header Component
const SectionHeader = ({ number, emoji, title }) => (
  <div className="flex items-center gap-3 mb-4">
    {number && <span className="font-black text-lg italic">{number}</span>}
    {emoji && <span className="text-lg">{emoji}</span>}
    <h3 className="text-sm font-black uppercase tracking-widest italic" style={gradientTextStyle}>{title}</h3>
  </div>
);

// Main App
export default function GamalielDashboard() {
  // Form state
  const [sermonTitle, setSermonTitle] = useState('');
  const [preachDate, setPreachDate] = useState('');
  const [primaryGoal, setPrimaryGoal] = useState('');
  const [mediaType, setMediaType] = useState('voice');
  const [recordingStatus, setRecordingStatus] = useState('ready');

  // Sacred Foundation
  const [theologicalFidelity, setTheologicalFidelity] = useState(false);
  const [exegeticalSoundness, setExegeticalSoundness] = useState(false);
  const [gospelCentrality, setGospelCentrality] = useState(false);

  // Structural Weight (Section 2)
  const [relevancy, setRelevancy] = useState(0);
  const [clarity, setClarity] = useState(0);
  const [connectivity, setConnectivity] = useState(0);
  const [precision, setPrecision] = useState(0);
  const [callToAction, setCallToAction] = useState(0);

  // Vocal Cadence (Section 3)
  const [relatability, setRelatability] = useState(0);
  const [pacing, setPacing] = useState(0);
  const [enthusiasm, setEnthusiasm] = useState(0);
  const [charisma, setCharisma] = useState(0);

  // Post Analysis
  const [anchoringPoint, setAnchoringPoint] = useState('');
  const [structuralDrift, setStructuralDrift] = useState('');
  const [measurableStep, setMeasurableStep] = useState('');

  // Calculate total score
  const totalScore = relevancy + clarity + connectivity + precision + callToAction +
    relatability + pacing + enthusiasm + charisma;

  return (
    <div className="min-h-screen text-white font-sans selection:bg-orange-500/30" style={{
      background: `radial-gradient(circle at 10% 10%, rgba(255, 69, 0, 0.12) 0%, transparent 40%), radial-gradient(circle at 90% 90%, rgba(139, 0, 139, 0.12) 0%, transparent 40%), radial-gradient(circle at 50% 50%, rgba(57, 255, 20, 0.02) 0%, transparent 50%), #070304`
    }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#070304]/80 backdrop-blur-2xl">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-serif italic font-bold">SI</span>
            <div className="h-4 w-px bg-white/20 mx-1" />
            <span className="text-[8px] font-black tracking-[0.3em] uppercase">Scribe Inc.</span>
          </div>
          <GradientButton className="!py-2 !px-4 !text-[8px] !rounded-lg">
            SAVE
          </GradientButton>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section - Left aligned */}
        <section className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tighter uppercase mb-3">
            <span style={gradientTextStyle}>HOMILETICS</span>
            <br />
            <span className="text-[#FF4500]">SCORECARD</span>
          </h1>
          <p className="text-white/70 text-sm font-light leading-relaxed max-w-md">
            Premium digital analysis of sermon weight, structure, and delivery. Designed for intentional preachers.
          </p>
        </section>

        {/* Sermon Info Card */}
        <GlassCard className="mb-6">
          <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[8px] font-black text-white tracking-[0.3em] uppercase flex items-center gap-1">
                <span>📖</span> Sermon Title/Text
              </label>
              <input
                type="text"
                placeholder="e.g. Romans 8:1-4"
                value={sermonTitle}
                onChange={(e) => setSermonTitle(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-orange-500/50 text-white placeholder:text-white/40 text-xs font-mono"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[8px] font-black text-white tracking-[0.3em] uppercase flex items-center gap-1">
                <span>📅</span> Preach Date
              </label>
              <input
                type="date"
                value={preachDate}
                onChange={(e) => setPreachDate(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-orange-500/50 text-white text-xs font-mono [color-scheme:dark]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[8px] font-black text-white tracking-[0.3em] uppercase flex items-center gap-1">
                <span>🎯</span> Primary Goal
              </label>
              <input
                type="text"
                placeholder="The core objective"
                value={primaryGoal}
                onChange={(e) => setPrimaryGoal(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-orange-500/50 text-white placeholder:text-white/40 text-xs font-mono"
              />
            </div>
          </div>
        </GlassCard>

        {/* Digital Capture Section */}
        <section className="mb-6">
          <SectionHeader emoji="📹" title="Digital Capture" />
          <GlassCard>
            <div className="p-5">
              <div className="flex flex-col gap-4">
                <div>
                  <h4 className="text-sm font-bold tracking-tight uppercase" style={gradientTextStyle}>Sermon Recording</h4>
                  <p className="text-[10px] text-white/70 leading-relaxed mt-1">Analyze the rhythm of the spoken word in real-time through high-fidelity capture.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* AI Assistant Button */}
                  <div className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2 border border-white/5 hover:border-[#39ff14]/30 transition-all cursor-pointer flex-1 min-w-[200px]">
                    <div className="flex flex-col flex-1">
                      <span className="text-[7px] font-mono font-bold text-[#39ff14] uppercase tracking-[0.2em]">🤖 Gamaliel AI Assistant</span>
                      <span className="text-white text-[9px] font-mono font-bold uppercase tracking-widest mt-0.5">Start AI Analysis</span>
                    </div>
                    <AIPulse />
                  </div>

                  {/* Recording Controls */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-white/5">
                      <button
                        onClick={() => setMediaType('voice')}
                        className={`flex items-center gap-1 transition-colors ${mediaType === 'voice' ? 'text-[#FF4500]' : 'text-white/60 hover:text-white'}`}
                      >
                        <span className="text-sm">🎙️</span>
                        <span className="text-[8px] font-bold uppercase tracking-wider">Voice</span>
                      </button>
                      <div className="w-px h-4 bg-white/10" />
                      <button
                        onClick={() => setMediaType('video')}
                        className={`flex items-center gap-1 transition-colors ${mediaType === 'video' ? 'text-[#FF4500]' : 'text-white/60 hover:text-white'}`}
                      >
                        <span className="text-sm">📹</span>
                        <span className="text-[8px] font-bold uppercase tracking-wider">Video</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setRecordingStatus(recordingStatus === 'ready' ? 'recording' : 'ready')}
                      className="w-9 h-9 rounded-full border-2 border-orange-500/30 flex items-center justify-center active:scale-90 transition-transform"
                    >
                      <div className={`rounded-full bg-[#FF4500] ${recordingStatus === 'recording' ? 'w-2.5 h-2.5 rounded-sm' : 'w-4 h-4'}`} style={{
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
            <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <CheckboxItem
                label="Theological Fidelity"
                subtitle="Doctrinal accuracy"
                checked={theologicalFidelity}
                onToggle={() => setTheologicalFidelity(!theologicalFidelity)}
              />
              <CheckboxItem
                label="Exegetical Soundness"
                subtitle="Contextual integrity"
                checked={exegeticalSoundness}
                onToggle={() => setExegeticalSoundness(!exegeticalSoundness)}
              />
              <CheckboxItem
                label="Gospel Centrality"
                subtitle="Christ-focused"
                checked={gospelCentrality}
                onToggle={() => setGospelCentrality(!gospelCentrality)}
              />
            </div>
          </GlassCard>
        </section>

        {/* Sections 2 & 3 Side by Side */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Section 2: Structural Weight */}
          <section className="min-w-0">
            <SectionHeader number="2️⃣" title="Structural Weight" />
            <GlassCard className="h-auto">
              <div className="p-4">
                <SpectrumSlider label="Relevancy" value={relevancy} onChange={setRelevancy} />
                <SpectrumSlider label="Clarity" value={clarity} onChange={setClarity} />
                <SpectrumSlider label="Connectivity" value={connectivity} onChange={setConnectivity} />
                <SpectrumSlider label="Precision" value={precision} onChange={setPrecision} />
                <SpectrumSlider label="Call to Action" value={callToAction} onChange={setCallToAction} />
              </div>
            </GlassCard>
          </section>

          {/* Section 3: Vocal Cadence */}
          <section className="min-w-0">
            <SectionHeader number="3️⃣" title="Vocal Cadence" />
            <GlassCard className="h-auto">
              <div className="p-4">
                <SpectrumSlider label="Relatability" value={relatability} onChange={setRelatability} />
                <SpectrumSlider label="Pacing" value={pacing} onChange={setPacing} />
                <SpectrumSlider label="Enthusiasm" value={enthusiasm} onChange={setEnthusiasm} />
                <SpectrumSlider label="Charisma" value={charisma} onChange={setCharisma} />
                {/* Spacer to match height with Section 2 */}
                <div className="h-[52px]"></div>
              </div>
            </GlassCard>
          </section>
        </div>

        {/* Critical Post-Analysis */}
        <section className="mb-6">
          <h3 className="text-base font-black uppercase tracking-[0.2em] italic text-center mb-4" style={gradientTextStyle}>Critical Post-Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GlassCard className="h-full">
              <div className="p-4 h-full flex flex-col">
                <label className="text-[8px] font-black text-white tracking-[0.3em] uppercase flex items-center gap-1 mb-2">
                  <span className="text-amber-400">⚡</span> Anchoring Point
                </label>
                <textarea
                  placeholder="Describe the most impactful segment..."
                  value={anchoringPoint}
                  onChange={(e) => setAnchoringPoint(e.target.value)}
                  className="flex-1 bg-transparent border-0 focus:ring-0 focus:outline-none text-white placeholder:text-white/20 resize-none text-xs font-light font-mono min-h-[80px]"
                />
              </div>
            </GlassCard>
            <GlassCard className="h-full">
              <div className="p-4 h-full flex flex-col">
                <label className="text-[8px] font-black text-white tracking-[0.3em] uppercase flex items-center gap-1 mb-2">
                  <span className="text-blue-400">📉</span> Structural Drift
                </label>
                <textarea
                  placeholder="Identify loss of focus..."
                  value={structuralDrift}
                  onChange={(e) => setStructuralDrift(e.target.value)}
                  className="flex-1 bg-transparent border-0 focus:ring-0 focus:outline-none text-white placeholder:text-white/20 resize-none text-xs font-light font-mono min-h-[80px]"
                />
              </div>
            </GlassCard>
            <GlassCard className="h-full">
              <div className="p-4 h-full flex flex-col">
                <label className="text-[8px] font-black text-white tracking-[0.3em] uppercase flex items-center gap-1 mb-2">
                  <span className="text-emerald-400">✅</span> Measurable Step
                </label>
                <textarea
                  placeholder="Specific improvement task..."
                  value={measurableStep}
                  onChange={(e) => setMeasurableStep(e.target.value)}
                  className="flex-1 bg-transparent border-0 focus:ring-0 focus:outline-none text-white placeholder:text-white/20 resize-none text-xs font-light font-mono min-h-[80px]"
                />
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Calculate Score Section - Centered */}
        <section className="flex flex-col items-center justify-center gap-6 py-6 mb-6">
          <GradientButton onClick={() => console.log('Calculate:', totalScore)}>
            CALCULATE SCORE
          </GradientButton>

          <div className="flex items-center gap-6">
            <GlassCard className="w-24 h-24" rounded="full">
              <div className="w-full h-full flex flex-col items-center justify-center">
                <span className="text-[8px] font-black tracking-tight uppercase" style={gradientTextStyle}>INDEX</span>
                <span className="text-2xl font-black text-white font-mono">{totalScore}/90</span>
              </div>
            </GlassCard>
            <div className="max-w-[100px]">
              <p className="text-[8px] text-white uppercase font-black tracking-[0.2em] leading-relaxed">Composite Homiletics Index (CHI)</p>
            </div>
          </div>
        </section>

        {/* Glossary */}
        <GlassCard className="mb-8">
          <h4 className="text-base font-black uppercase tracking-widest italic text-center pt-5 mb-4" style={gradientTextStyle}>Glossary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 pt-0">
            {[
              { term: 'Fidelity', def: 'Precise adherence to the original intent of the biblical author.' },
              { term: 'Exegesis', def: 'Drawing meaning from the text, never reading into it.' },
              { term: 'Precision', def: 'Surgical use of language to maximize clarity and impact.' },
              { term: 'Cadence', def: 'The rhythmic flow of delivery that aids retention.' },
            ].map((item, i) => (
              <div key={i} className="border-l border-orange-500/20 pl-3">
                <h5 className="font-black mb-1 uppercase tracking-widest text-[9px]" style={gradientTextStyle}>{item.term}</h5>
                <p className="text-[9px] text-white/60 leading-relaxed italic">{item.def}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 bg-black/40">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 opacity-70">
            <span className="text-lg font-serif italic font-bold text-white">SI</span>
            <div className="h-3 w-px bg-white/40 mx-1" />
            <span className="text-[8px] font-black tracking-[0.3em] uppercase text-white">Scribe Inc.</span>
          </div>
          <p className="text-[8px] tracking-[0.5em] text-white/50 uppercase font-black">
            © 2026 SCRIBE INC. • WE FIX WHAT MARKETING CANNOT
          </p>
        </div>
      </footer>

      {/* Custom slider styles */}
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

        /* Ensure consistent spacing on mobile */
        @media (max-width: 640px) {
          .grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
    </div>
  );
}
