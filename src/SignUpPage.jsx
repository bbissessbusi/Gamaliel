import React, { useState } from 'react';
import Logo from './components/Logo';

export default function SignUpPage({ onSignUp, onNavigateLogin }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onSignUp(fullName, email, password);
    } catch (err) {
      setError(err.message || 'Sign up failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen text-white selection:bg-primary/30 flex flex-col"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {/* Mesh Background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `radial-gradient(circle at 10% 10%, rgba(255, 69, 0, 0.15) 0%, transparent 40%),
                       radial-gradient(circle at 90% 90%, rgba(139, 0, 139, 0.2) 0%, transparent 40%),
                       radial-gradient(circle at 50% 50%, rgba(0, 56, 255, 0.1) 0%, transparent 60%),
                       #050203`,
        }}
      />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-16" style={{ paddingTop: 'max(4rem, env(safe-area-inset-top, 0px))' }}>
        <div className="signup-glass-slate w-full max-w-[480px] px-6 sm:px-14 py-12 sm:py-20 flex flex-col items-center">
          {/* Logo */}
          <div className="mb-10">
            <Logo height={48} showLabel={false} />
          </div>

          {/* Error Message */}
          {error && (
            <div className="w-full mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-center">
              <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {error}
              </p>
            </div>
          )}

          {/* Form */}
          <form className="w-full space-y-5 relative z-30" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                className="text-[10px] text-white/60 ml-1 uppercase tracking-[0.2em]"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                FULL NAME
              </label>
              <div className="signup-input-wrapper relative">
                <input
                  className="w-full bg-white/5 border-0 rounded-xl px-4 py-3 text-sm placeholder:text-white/20 focus:ring-0 focus:outline-none text-white"
                  style={{ fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', fontSize: '16px' }}
                  placeholder="ENTER NAME"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="text-[10px] text-white/60 ml-1 uppercase tracking-[0.2em]"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                EMAIL ADDRESS
              </label>
              <div className="signup-input-wrapper relative">
                <input
                  className="w-full bg-white/5 border-0 rounded-xl px-4 py-3 text-sm placeholder:text-white/20 focus:ring-0 focus:outline-none text-white"
                  style={{ fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', fontSize: '16px' }}
                  placeholder="ENTER EMAIL"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="text-[10px] text-white/60 ml-1 uppercase tracking-[0.2em]"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                PASSWORD
              </label>
              <div className="signup-input-wrapper relative">
                <input
                  className="w-full bg-white/5 border-0 rounded-xl px-4 py-3 text-sm placeholder:text-white/20 focus:ring-0 focus:outline-none text-white"
                  style={{ fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', fontSize: '16px' }}
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="pt-6">
              <button
                className="w-full py-4 signup-btn-gradient rounded-xl font-bold text-sm tracking-[0.4em] uppercase text-white transition-all active:scale-95"
                style={{ fontFamily: "'JetBrains Mono', monospace", minHeight: '52px' }}
                type="submit"
                disabled={loading}
              >
                {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
              </button>
            </div>

            <div className="flex justify-center items-center pt-6">
              <button
                type="button"
                onClick={onNavigateLogin}
                className="text-[9px] text-white/80 hover:text-white transition-colors uppercase tracking-[0.2em] group"
                style={{ fontFamily: "'JetBrains Mono', monospace", minHeight: '44px', display: 'flex', alignItems: 'center' }}
              >
                ALREADY HAVE AN ACCOUNT? <span className="text-[#FF4500] group-hover:underline ml-1">LOGIN</span>
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 flex flex-col items-center gap-3" style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom, 0px))' }}>
        <div className="flex items-center gap-2 opacity-70">
          <span className="material-symbols-outlined text-[14px]">copyright</span>
          <span
            className="text-[9px] font-bold uppercase tracking-[0.2em]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            THE SCRIBES INC.
          </span>
        </div>
        <p className="text-[8px] tracking-[1.2em] text-white/25 uppercase font-black text-center">
          WE FIX WHAT MARKETING CANNOT
        </p>
      </footer>

      {/* Scoped Styles */}
      <style>{`
        .signup-glass-slate {
          position: relative;
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(100px) saturate(180%);
          -webkit-backdrop-filter: blur(100px) saturate(180%);
          border-radius: 60px;
          box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.7), inset 0 0 80px rgba(255, 255, 255, 0.03);
        }
        @media (min-width: 640px) {
          .signup-glass-slate { border-radius: 120px; }
        }
        .signup-glass-slate::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 2.5px;
          background: linear-gradient(135deg, #FF4500, #D12D6F, #8B008B);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          opacity: 1;
        }
        .signup-input-wrapper::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 0.75rem;
          padding: 1px;
          background: linear-gradient(90deg, #FF4500, #D12D6F, #8B008B);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0.3;
          pointer-events: none;
        }
        .signup-input-wrapper:focus-within::after {
          opacity: 1;
        }
        .signup-btn-gradient {
          background: linear-gradient(135deg, #FF4500 0%, #8B008B 100%);
          box-shadow: 0 4px 15px rgba(255, 69, 0, 0.3);
        }
        .signup-btn-gradient:hover {
          filter: brightness(1.1);
          box-shadow: 0 6px 20px rgba(255, 69, 0, 0.5);
        }
      `}</style>
    </div>
  );
}
