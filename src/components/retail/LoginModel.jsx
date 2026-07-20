'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter }                    from 'next/navigation';
import { useRetailAuth }                from '@/context/RetailAuthContext';
import { signIn }                       from 'next-auth/react';
import Image                            from 'next/image';

const STEP = { EMAIL: 'email', OTP: 'otp', DONE: 'done' };

export default function LoginModal({ isOpen, onClose }) {
  const { refreshUser } = useRetailAuth();
  const router = useRouter();

  const [step,       setStep]       = useState(STEP.EMAIL);
  const [email,      setEmail]      = useState('');
  const [otp,        setOtp]        = useState(['', '', '', '', '', '']);
  const [busy,       setBusy]       = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [error,      setError]      = useState('');
  const [countdown,  setCountdown]  = useState(0);

  const otpRefs = useRef([]);

  // Reset state every time modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(STEP.EMAIL);
      setEmail('');
      setOtp(['', '', '', '', '', '']);
      setError('');
      setBusy(false);
      setGoogleBusy(false);
      setCountdown(0);
    }
  }, [isOpen]);

  // Countdown for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Auto-submit when all 6 digits entered — must be before any early return
  useEffect(() => {
    if (step === STEP.OTP && otp.join('').length === 6) handleVerifyOtp();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp, step]);

  if (!isOpen) return null;

  // ── Send email OTP ────────────────────────────────────────────────────────
  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setError('');
    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address.');
      return;
    }
    setBusy(true);
    try {
      const res  = await fetch('/api/retail/auth/send-email-otp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to send code.'); return; }
      setStep(STEP.OTP);
      setOtp(['', '', '', '', '', '']);
      setCountdown(60);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch { setError('Network error. Please try again.'); }
    finally   { setBusy(false); }
  };

  // ── OTP input handlers ────────────────────────────────────────────────────
  const handleOtpChange = (i, val) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const next = [...otp]; next[i] = digit; setOtp(next); setError('');
    if (digit && i < 5) otpRefs.current[i + 1]?.focus();
  };
  const handleOtpKeyDown = (i, e) => {
    if (e.key === 'Backspace') {
      if (otp[i]) { const n = [...otp]; n[i] = ''; setOtp(n); }
      else if (i > 0) otpRefs.current[i - 1]?.focus();
    }
    if (e.key === 'ArrowLeft'  && i > 0) otpRefs.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < 5) otpRefs.current[i + 1]?.focus();
  };
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const p = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!p) return;
    const n = ['', '', '', '', '', ''];
    p.split('').forEach((d, i) => { n[i] = d; });
    setOtp(n);
    otpRefs.current[Math.min(p.length, 5)]?.focus();
  };

  const getLoginCallback = () => {
    if (typeof window === 'undefined') return '/retail/account';
    const callback = sessionStorage.getItem('retailLoginCallback');
    return callback || '/retail/account';
  };

  const clearLoginCallback = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('retailLoginCallback');
    }
  };

  // ── Verify OTP ────────────────────────────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    setError('');
    const otpStr = otp.join('');
    if (otpStr.length < 6) { setError('Please enter the 6-digit code.'); return; }
    setBusy(true);
    try {
      const res  = await fetch('/api/retail/auth/verify-email-otp', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp: otpStr }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Incorrect code.'); return; }
      setStep(STEP.DONE);
      await refreshUser();
      setTimeout(() => {
        try { if (typeof window !== 'undefined') localStorage.setItem('accountLogin', 'true'); } catch (e) { /* ignore */ }
        const callback = getLoginCallback();
        clearLoginCallback();
        onClose();
        router.push(callback);
      }, 900);
    } catch { setError('Network error. Please try again.'); }
    finally   { setBusy(false); }
  };

  // ── Google OAuth ──────────────────────────────────────────────────────────
  const handleGoogle = async () => {
    setError(''); setGoogleBusy(true);
    try {
      const callback = getLoginCallback();
      const cb = typeof window !== 'undefined' ? window.location.origin + callback : '/retail/account';
      await signIn('google', { callbackUrl: cb, redirect: true });
    } catch {
      setError('Could not start Google sign-in.');
      setGoogleBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-[400px] bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-2xl text-gray-300 hover:text-gray-600 transition-colors z-10 leading-none"
          aria-label="Close"
        >
          ×
        </button>

        <div className="px-8 pt-8 pb-2">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image src="/retail/Union.png" alt="ivara" width={70} height={35} className="object-contain" />
          </div>

          {step === STEP.EMAIL && (
            <>
              <h2 className="text-[20px] font-semibold text-[#281000] mb-1 text-center">Welcome</h2>
              <p className="text-gray-400 text-sm mb-6 text-center">Sign in or create a new account</p>
            </>
          )}

          {step === STEP.OTP && (
            <>
              <button
                onClick={() => { setStep(STEP.EMAIL); setError(''); setOtp(['','','','','','']); }}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-[#281000] mb-4 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <h2 className="text-[20px] font-semibold text-[#281000] mb-1">Check your inbox</h2>
              <p className="text-gray-400 text-sm mb-1">6-digit code sent to</p>
              <p className="text-sm font-semibold text-[#281000] mb-5 break-all">{email}</p>
            </>
          )}

          {step === STEP.DONE && (
            <div className="py-8 text-center">
              <div className="w-14 h-14 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
                <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-[16px] font-semibold text-green-600">Signed in successfully</p>
              <p className="text-gray-400 text-sm mt-1">Redirecting to your account…</p>
            </div>
          )}
        </div>

        {step !== STEP.DONE && (
          <div className="px-8 pb-8">
            {/* Error */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600 flex items-start gap-2">
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* ── EMAIL STEP ── */}
            {step === STEP.EMAIL && (
              <>
                {/* Google */}
                <button
                  onClick={handleGoogle}
                  disabled={googleBusy || busy}
                  className="w-full h-11 flex items-center justify-center gap-2.5 border border-gray-200 hover:border-[#281000] rounded-2xl text-sm font-medium text-[#281000] transition-all disabled:opacity-50 mb-4"
                >
                  {googleBusy
                    ? <div className="w-4 h-4 border-2 border-[#281000] border-t-transparent rounded-full animate-spin" />
                    : <><GoogleIcon /> Continue with Google</>
                  }
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-xs text-gray-400">or use email</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>

                <form onSubmit={handleSendOtp} noValidate>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Email address
                  </label>
                  <input
                    type="email" value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder="you@example.com"
                    autoComplete="email"
                    autoFocus
                    className="w-full h-11 border border-gray-200 focus:border-[#281000] rounded-2xl px-4 outline-none text-[#281000] placeholder:text-gray-300 text-sm transition-colors"
                  />
                  <button
                    type="submit" disabled={busy || !email.trim()}
                    className="w-full mt-3 h-11 bg-[#281000] hover:bg-black text-white rounded-2xl text-sm font-semibold transition-all disabled:opacity-50"
                  >
                    {busy
                      ? <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending…
                        </span>
                      : 'Send Verification Code →'
                    }
                  </button>
                </form>

                <p className="text-[11px] text-gray-300 mt-5 text-center leading-relaxed">
                  By continuing, you agree to our{' '}
                  <a href="/retail/terms"   className="underline text-gray-400 hover:text-[#281000]">Terms</a>
                  {' '}&amp;{' '}
                  <a href="/retail/privacy" className="underline text-gray-400 hover:text-[#281000]">Privacy Policy</a>
                </p>
              </>
            )}

            {/* ── OTP STEP ── */}
            {step === STEP.OTP && (
              <>
                <form onSubmit={handleVerifyOtp} noValidate>
                  <div className="flex gap-2 mb-5" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { otpRefs.current[i] = el; }}
                        type="text" inputMode="numeric" pattern="\d*" maxLength={1} value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className={`flex-1 aspect-square text-center text-xl font-bold border-2 rounded-xl outline-none transition-all
                          ${digit ? 'border-[#281000] bg-[#281000]/5 text-[#281000]' : 'border-gray-200 text-[#281000]'}
                          focus:border-[#281000]`}
                      />
                    ))}
                  </div>
                  <button
                    type="submit" disabled={busy || otp.join('').length < 6}
                    className="w-full h-11 bg-[#281000] hover:bg-black text-white rounded-2xl text-sm font-semibold transition-all disabled:opacity-50"
                  >
                    {busy
                      ? <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Verifying…
                        </span>
                      : 'Verify & Sign In →'
                    }
                  </button>
                </form>

                <div className="mt-4 text-center">
                  {countdown > 0 ? (
                    <p className="text-sm text-gray-400">Resend in <span className="font-semibold text-[#281000]">{countdown}s</span></p>
                  ) : (
                    <button onClick={handleSendOtp} disabled={busy} className="text-sm text-[#281000] underline hover:text-black disabled:opacity-50">
                      Resend code
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}
