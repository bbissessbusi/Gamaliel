import React, { useState, useEffect } from 'react';
import Logo from './components/Logo';

export default function LoginPage({ onLogin, onOAuthLogin, onNavigateSignUp, onNavigateForgotPassword }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Load remembered email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('gamaliel_remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Save or clear remembered email
      if (rememberMe) {
        localStorage.setItem('gamaliel_remembered_email', email);
      } else {
        localStorage.removeItem('gamaliel_remembered_email');
      }
      await onLogin(email, password);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    }
    setLoading(false);
  };

  const handleOAuth = async (provider) => {
    setOauthLoading(provider);
    setError('');
    try {
      await onOAuthLogin(provider);
    } catch (err) {
      setError(err.message || `${provider} sign-in failed. Please try again.`);
      setOauthLoading('');
    }
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
          background: `radial-gradient(circle at 10% 10%, rgba(255, 69, 0, 0.12) 0%, transparent 40%),
                       radial-gradient(circle at 90% 90%, rgba(139, 0, 139, 0.15) 0%, transparent 40%),
                       radial-gradient(circle at 50% 50%, rgba(0, 56, 255, 0.08) 0%, transparent 60%),
                       #050203`,
        }}
      />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-16" style={{ paddingTop: 'max(4rem, env(safe-area-inset-top, 0px))' }}>
        <div className="login-glass-slate w-full max-w-[480px] px-6 sm:px-14 py-12 sm:py-20 flex flex-col items-center">
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

          {/* OAuth Buttons */}
          <div className="w-full space-y-3 relative z-30 mb-6">
            <button
              type="button"
              onClick={() => handleOAuth('google')}
              disabled={!!oauthLoading || loading}
              className="w-full flex items-center justify-center gap-3 py-3.5 bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 hover:border-white/20 rounded-xl transition-all active:scale-[0.98] disabled:opacity-40"
              style={{ minHeight: '52px' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 0 0 1 12c0 1.93.46 3.77 1.18 5.42l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span
                className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {oauthLoading === 'google' ? 'Connecting...' : 'Continue with Google'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleOAuth('apple')}
              disabled={!!oauthLoading || loading}
              className="w-full flex items-center justify-center gap-3 py-3.5 bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 hover:border-white/20 rounded-xl transition-all active:scale-[0.98] disabled:opacity-40"
              style={{ minHeight: '52px' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              <span
                className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {oauthLoading === 'apple' ? 'Connecting...' : 'Continue with Apple'}
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="w-full flex items-center gap-4 mb-6 relative z-30">
            <div className="flex-1 h-px bg-white/10" />
            <span
              className="text-[9px] text-white/30 uppercase tracking-[0.3em]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              or
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Form */}
          <form className="w-full space-y-6 relative z-30" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                className="text-[10px] text-white/60 ml-1 uppercase tracking-[0.2em]"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                EMAIL ADDRESS
              </label>
              <div className="login-input-wrapper relative">
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
              <div className="login-input-wrapper relative">
                <input
                  className="w-full bg-white/5 border-0 rounded-xl px-4 py-3 pr-12 text-sm placeholder:text-white/20 focus:ring-0 focus:outline-none text-white"
                  style={{ fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', fontSize: '16px' }}
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors z-10"
                  style={{ minWidth: '24px', minHeight: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-3 px-1">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className="relative w-5 h-5 rounded-md border border-white/20 hover:border-white/40 transition-all flex items-center justify-center flex-shrink-0"
                style={{ background: rememberMe ? 'linear-gradient(135deg, #FF4500, #8B008B)' : 'rgba(255,255,255,0.05)' }}
                aria-label="Remember me"
              >
                {rememberMe && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
              <span
                className="text-[10px] text-white/50 uppercase tracking-[0.15em] cursor-pointer select-none"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                onClick={() => setRememberMe(!rememberMe)}
              >
                Remember Me
              </span>
            </div>

            <div className="pt-4">
              <button
                className="w-full py-4 login-btn-gradient rounded-xl font-bold text-sm tracking-[0.4em] uppercase text-white transition-all active:scale-95"
                style={{ fontFamily: "'JetBrains Mono', monospace", minHeight: '52px' }}
                type="submit"
                disabled={loading || !!oauthLoading}
              >
                {loading ? 'LOGGING IN...' : 'LOGIN'}
              </button>
            </div>

            <div className="flex justify-between items-center pt-6 px-1">
              <button
                type="button"
                onClick={onNavigateForgotPassword}
                className="text-[9px] text-white hover:text-[#FF4500] transition-colors uppercase tracking-[0.2em]"
                style={{ fontFamily: "'JetBrains Mono', monospace", minHeight: '44px', display: 'flex', alignItems: 'center' }}
              >
                Forgot Password
              </button>
              <button
                type="button"
                onClick={onNavigateSignUp}
                className="text-[9px] text-white hover:text-[#FF4500] transition-colors uppercase tracking-[0.2em]"
                style={{ fontFamily: "'JetBrains Mono', monospace", minHeight: '44px', display: 'flex', alignItems: 'center' }}
              >
                Sign Up
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
        .login-glass-slate {
          position: relative;
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(80px) saturate(200%);
          -webkit-backdrop-filter: blur(80px) saturate(200%);
          border-radius: 60px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 80px rgba(255, 255, 255, 0.05);
        }
        @media (min-width: 640px) {
          .login-glass-slate { border-radius: 120px; }
        }
        .login-glass-slate::before {
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
        .login-input-wrapper::after {
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
          opacity: 0.4;
          pointer-events: none;
        }
        .login-input-wrapper:focus-within::after {
          opacity: 1;
        }
        .login-btn-gradient {
          background: linear-gradient(135deg, #FF4500 0%, #8B008B 100%);
          box-shadow: 0 4px 15px rgba(255, 69, 0, 0.3);
        }
        .login-btn-gradient:hover {
          filter: brightness(1.1);
          box-shadow: 0 6px 20px rgba(255, 69, 0, 0.5);
        }
      `}</style>
    </div>
  );
}
