import React, { useState, useEffect, useRef } from 'react';
import { analyzeSermon } from './services/claudeService';

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

// Glass Card Component with proper reflective effects and jump hover
const GlassCard = ({ children, className = '', rounded = '2xl' }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className={`relative overflow-hidden ${rounded === 'full' ? 'rounded-full' : 'rounded-2xl'} ${className} transition-all duration-300 ease-out cursor-pointer`}
      style={{
        background: 'rgba(255, 255, 255, 0.025)',
        backdropFilter: 'blur(16px) saturate(180%)',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 20px 40px -15px rgba(255, 69, 0, 0.3), 0 10px 20px -10px rgba(139, 0, 139, 0.2)'
          : '0 0 0 transparent',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient border */}
      <div className={`absolute inset-0 ${rounded === 'full' ? 'rounded-full' : 'rounded-2xl'} pointer-events-none transition-opacity duration-300`} style={{
        padding: '1px',
        background: 'linear-gradient(135deg, #FF4500, #D12D6F, #8B008B)',
        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        maskComposite: 'exclude',
        WebkitMaskComposite: 'xor',
        opacity: isHovered ? 0.8 : 0.5
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
};

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

// Gradient Button with reflective effect and cave-in click
const GradientButton = ({ children, onClick, className = '' }) => {
  const [isPressed, setIsPressed] = React.useState(false);

  return (
    <button
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      className={`relative overflow-hidden text-white px-8 py-4 rounded-2xl font-black text-xs tracking-[0.3em] uppercase transition-all duration-150 hover:scale-105 ${className}`}
      style={{
        background: isPressed
          ? 'linear-gradient(90deg, #CC3700 0%, #6B006B 100%)'
          : 'linear-gradient(90deg, #FF4500 0%, #8B008B 100%)',
        boxShadow: isPressed
          ? 'inset 0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(255, 69, 0, 0.3)'
          : '0 10px 30px -10px rgba(255, 69, 0, 0.5)',
        transform: isPressed ? 'scale(0.97)' : undefined,
      }}
    >
      {/* Top specular highlight - hidden when pressed */}
      <div
        className="absolute top-0 left-[10%] right-[10%] h-[1px] pointer-events-none transition-opacity duration-150"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.2), transparent)',
          opacity: isPressed ? 0 : 1
        }}
      />
      {children}
    </button>
  );
};

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
  const [recordingStatus, setRecordingStatus] = useState('ready'); // 'ready', 'recording', 'stopped'

  // Media & Recording state
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const timerRef = useRef(null);
  const fileInputRef = useRef(null);

  // AI Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

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

  // Format recording time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMediaFile(file);
      setMediaPreviewUrl(URL.createObjectURL(file));
      setRecordingStatus('stopped');
      // Auto-detect media type
      if (file.type.startsWith('video/')) {
        setMediaType('video');
      } else {
        setMediaType('voice');
      }
    }
  };

  // Start recording
  const startRecording = async () => {
    try {
      const constraints = mediaType === 'video'
        ? { audio: true, video: true }
        : { audio: true };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      const mimeType = mediaType === 'video' ? 'video/webm' : 'audio/webm';
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
      recordedChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: mimeType });
        const file = new File([blob], `sermon-recording.${mediaType === 'video' ? 'webm' : 'webm'}`, { type: mimeType });
        setMediaFile(file);
        setMediaPreviewUrl(URL.createObjectURL(blob));

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setRecordingStatus('recording');
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(t => t + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone/camera. Please check permissions.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingStatus === 'recording') {
      mediaRecorderRef.current.stop();
      setRecordingStatus('stopped');
      clearInterval(timerRef.current);
    }
  };

  // Toggle recording
  const toggleRecording = () => {
    if (recordingStatus === 'recording') {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Clear media
  const clearMedia = () => {
    setMediaFile(null);
    setMediaPreviewUrl(null);
    setRecordingStatus('ready');
    setRecordingTime(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Run AI analysis
  const runAnalysis = async () => {
    if (!mediaFile) {
      alert('Please upload or record a sermon first.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    setShowAnalysisModal(true);

    try {
      const result = await analyzeSermon(mediaFile, {
        title: sermonTitle,
        goal: primaryGoal,
        date: preachDate,
      });

      setAnalysisResult(result);

      // Auto-fill scores from AI analysis
      if (result.scores) {
        const s = result.scores;
        // Sacred Foundation
        if (s.theologicalFidelity !== null) setTheologicalFidelity(s.theologicalFidelity);
        if (s.exegeticalSoundness !== null) setExegeticalSoundness(s.exegeticalSoundness);
        if (s.gospelCentrality !== null) setGospelCentrality(s.gospelCentrality);
        // Structural Weight
        if (s.relevancy !== null) setRelevancy(s.relevancy);
        if (s.clarity !== null) setClarity(s.clarity);
        if (s.connectivity !== null) setConnectivity(s.connectivity);
        if (s.precision !== null) setPrecision(s.precision);
        if (s.callToAction !== null) setCallToAction(s.callToAction);
        // Vocal Cadence
        if (s.relatability !== null) setRelatability(s.relatability);
        if (s.pacing !== null) setPacing(s.pacing);
        if (s.enthusiasm !== null) setEnthusiasm(s.enthusiasm);
        if (s.charisma !== null) setCharisma(s.charisma);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysisError(error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

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
        {/* Hero Section with Logo */}
        <section className="mb-8 flex flex-col items-center text-center">
          {/* App Logo with 3D Glass Effect */}
          <div
            className="relative overflow-hidden rounded-3xl mb-4 transition-all duration-300 ease-out hover:-translate-y-2"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px) saturate(180%)',
              boxShadow: '0 8px 32px -8px rgba(255, 69, 0, 0.2), 0 4px 16px -4px rgba(139, 0, 139, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
              padding: '20px 30px',
            }}
          >
            {/* Gradient border effect */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{
              padding: '1px',
              background: 'linear-gradient(135deg, rgba(255, 69, 0, 0.5), rgba(209, 45, 111, 0.5), rgba(139, 0, 139, 0.5))',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor',
            }} />
            {/* Top specular highlight */}
            <div className="absolute top-0 left-[15%] right-[15%] h-[1px] pointer-events-none" style={{
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.15), transparent)'
            }} />
            {/* Left edge specular highlight */}
            <div className="absolute top-[10%] left-0 bottom-[40%] w-[1px] pointer-events-none" style={{
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.25), transparent)'
            }} />
            {/* Logo Image */}
            <img
              src="/Applogo.png"
              alt="Gamaliel - Homiletics Scorecard"
              className="relative z-10 h-24 md:h-32 w-auto object-contain"
              style={{
                filter: 'drop-shadow(0 4px 12px rgba(255, 69, 0, 0.3))'
              }}
              onError={(e) => {
                // Fallback to text if logo not found
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'block';
              }}
            />
            {/* Fallback text if logo doesn't load */}
            <div className="hidden text-center">
              <h1 className="text-3xl md:text-4xl font-black leading-[1.1] tracking-tighter uppercase">
                <span style={gradientTextStyle}>HOMILETICS</span>
                <br />
                <span className="text-[#FF4500]">SCORECARD</span>
              </h1>
            </div>
          </div>
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
                  <p className="text-[10px] text-white/70 leading-relaxed mt-1">Upload a recording or record directly. Gamaliel will analyze your sermon delivery.</p>
                </div>

                {/* Upload & Record Options */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* File Upload Button */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="audio/*,video/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-2.5 border border-white/10 hover:border-orange-500/50 transition-all"
                  >
                    <span className="text-lg">📁</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-white">Upload File</span>
                  </button>

                  {/* Media Type Toggle */}
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

                  {/* Record Button */}
                  <button
                    onClick={toggleRecording}
                    className="w-10 h-10 rounded-full border-2 border-orange-500/30 flex items-center justify-center active:scale-90 transition-transform"
                  >
                    <div className={`bg-[#FF4500] ${recordingStatus === 'recording' ? 'w-3 h-3 rounded-sm' : 'w-4 h-4 rounded-full'}`} style={{
                      boxShadow: '0 0 12px #FF4500'
                    }} />
                  </button>
                  <span className="text-[8px] text-white uppercase font-black tracking-[0.3em]">
                    {recordingStatus === 'recording' ? formatTime(recordingTime) : recordingStatus === 'stopped' ? 'Done' : 'Record'}
                  </span>
                </div>

                {/* Media Preview */}
                {mediaFile && (
                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-white/70">
                        {mediaFile.type.startsWith('video/') ? '📹' : '🎙️'} {mediaFile.name}
                      </span>
                      <button
                        onClick={clearMedia}
                        className="text-[8px] font-bold uppercase tracking-wider text-red-400 hover:text-red-300"
                      >
                        ✕ Remove
                      </button>
                    </div>
                    {mediaPreviewUrl && (
                      mediaFile.type.startsWith('video/') ? (
                        <video src={mediaPreviewUrl} controls className="w-full rounded-lg max-h-48" />
                      ) : (
                        <audio src={mediaPreviewUrl} controls className="w-full" />
                      )
                    )}
                  </div>
                )}

                {/* AI Assistant Button */}
                <button
                  onClick={runAnalysis}
                  disabled={!mediaFile || isAnalyzing}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 border transition-all ${
                    mediaFile && !isAnalyzing
                      ? 'bg-[#39ff14]/10 border-[#39ff14]/30 hover:border-[#39ff14]/60 cursor-pointer'
                      : 'bg-white/5 border-white/5 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex flex-col flex-1 text-left">
                    <span className="text-[8px] font-mono font-bold text-[#39ff14] uppercase tracking-[0.2em]">🤖 Gamaliel AI Assistant</span>
                    <span className="text-white text-[10px] font-mono font-bold uppercase tracking-widest mt-0.5">
                      {isAnalyzing ? 'Analyzing Sermon...' : mediaFile ? 'Start AI Analysis' : 'Upload or Record First'}
                    </span>
                  </div>
                  {isAnalyzing ? (
                    <div className="w-4 h-4 border-2 border-[#39ff14] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <AIPulse />
                  )}
                </button>
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
        <section className="flex flex-col items-center justify-center py-6 mb-6">
          <GradientButton onClick={() => console.log('Calculate:', totalScore)}>
            CALCULATE SCORE
          </GradientButton>
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

      {/* Analysis Results Modal */}
      {showAnalysisModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl" style={{
            background: 'rgba(7, 3, 4, 0.95)',
            border: '1px solid rgba(255, 69, 0, 0.3)'
          }}>
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-white/10" style={{
              background: 'rgba(7, 3, 4, 0.98)'
            }}>
              <div className="flex items-center gap-2">
                <span className="text-lg">🤖</span>
                <h3 className="text-sm font-black uppercase tracking-widest" style={gradientTextStyle}>Gamaliel Analysis</h3>
              </div>
              <button
                onClick={() => setShowAnalysisModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <span className="text-white text-sm">✕</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 overflow-y-auto max-h-[calc(85vh-60px)]">
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className="w-12 h-12 border-3 border-[#39ff14] border-t-transparent rounded-full animate-spin" />
                  <p className="text-white/70 text-sm">Gamaliel is listening to your sermon...</p>
                  <p className="text-white/40 text-xs">This may take a moment for longer recordings</p>
                </div>
              ) : analysisError ? (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <h4 className="text-red-400 font-bold text-sm mb-2">Analysis Error</h4>
                  <p className="text-white/70 text-xs">{analysisError}</p>
                  <button
                    onClick={() => {
                      setAnalysisError(null);
                      runAnalysis();
                    }}
                    className="mt-3 px-4 py-2 bg-red-500/20 rounded-lg text-red-300 text-xs font-bold uppercase tracking-wider hover:bg-red-500/30 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : analysisResult ? (
                <div className="space-y-4">
                  {/* Success Message */}
                  <div className="bg-[#39ff14]/10 border border-[#39ff14]/30 rounded-xl p-3 flex items-center gap-2">
                    <span className="text-lg">✅</span>
                    <p className="text-[#39ff14] text-xs font-bold uppercase tracking-wider">Analysis Complete - Scores Updated</p>
                  </div>

                  {/* Full Analysis */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h4 className="text-xs font-black uppercase tracking-widest text-white/70 mb-3">Full Feedback</h4>
                    <div className="prose prose-invert prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap text-white/80 text-xs leading-relaxed font-sans">
                        {analysisResult.fullAnalysis}
                      </pre>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

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
