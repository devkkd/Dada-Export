'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter }            from 'next/navigation';
import { useRetailAuth }                         from '@/context/RetailAuthContext';
import Image                                     from 'next/image';

const RETAIL_AUTH = '/api/retail/auth';
const STEP = { EMAIL: 'email', OTP: 'otp' };

function LoginContent() {
  const { isLoggedIn, isLoading, refreshUser } = useRetailAuth();
  const router       = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get('callbackUrl') || '/retail/account';

  const [step,       setStep]       = useState(STEP.EMAIL);
  const [email,      setEmail]      = useState('');
  const [otp,        setOtp]        = useState(['', '', '', '', '', '']);
  const [busy,       setBusy]       = useState(false);
  const [error,      setError]      = useState('');
  const [countdown,  setCountdown]  = useState(0);
  const [googleBusy, setGoogleBusy] = useState(false);

  const otpRefs = useRef([]);

  useEffect(() => {
    if (!isLoading && isLoggedIn) router.replace(callbackUrl);
  }, [isLoggedIn, isLoading, router, callbackUrl]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // ── Send OTP ──────────────────────────────────────────────────────────────
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

  // ── OTP input ─────────────────────────────────────────────────────────────
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

  // ── Verify OTP ────────────────────────────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    setError('');
    const otpStr = otp.join('');
    if (otpStr.length < 6) { setError('Please enter the 6-digit code.'); return; }
    setBusy(true);
    try {
      const res = await fetch('/api/retail/auth/verify-email-otp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp: otpStr }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Incorrect code.'); return; }
      await refreshUser();
      router.replace(callbackUrl);
    } catch { setError('Network error. Please try again.'); }
    finally   { setBusy(false); }
  };

  // Auto-submit on 6 digits
  useEffect(() => {
    if (step === STEP.OTP && otp.join('').length === 6) handleVerifyOtp();
  }, [otp]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Google OAuth ──────────────────────────────────────────────────────────
  const handleGoogle = async () => {
    setError(''); setGoogleBusy(true);
    try {
      const { csrfToken } = await fetch(`${RETAIL_AUTH}/csrf`).then(r => r.json());
      const form = document.createElement('form');
      form.method = 'POST'; form.action = `${RETAIL_AUTH}/signin/google`;
      [['csrfToken', csrfToken], ['callbackUrl', callbackUrl]].forEach(([n, v]) => {
        const inp = document.createElement('input');
        inp.type = 'hidden'; inp.name = n; inp.value = v; form.appendChild(inp);
      });
      document.body.appendChild(form); form.submit();
    } catch { setError('Could not start Google sign-in.'); setGoogleBusy(false); }
  };

  // ── Loading spinner ───────────────────────────────────────────────────────
  if (isLoading) return (
    <div className="min-h-screen bg-[#F7F4EF] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#281000] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F7F4EF] flex items-center justify-center p-4">
      <div className="w-full max-w-[400px]">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image src="/retail/Union.png" alt="ivara" width={90} height={45} className="object-contain" />
        </div>

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="px-8 pt-8 pb-2">
            {step === STEP.EMAIL ? (
              <>
                <h2 className="text-[22px] font-semibold text-[#281000] mb-1">Welcome back</h2>
                <p className="text-gray-400 text-sm mb-7">Sign in or create a new account</p>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setStep(STEP.EMAIL); setError(''); setOtp(['','','','','','']); }}
                  className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#281000] mb-5 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                <h2 className="text-[22px] font-semibold text-[#281000] mb-1">Check your inbox</h2>
                <p className="text-gray-400 text-sm mb-1">We sent a 6-digit code to</p>
                <p className="text-sm font-medium text-[#281000] mb-6 break-all">{email}</p>
              </>
            )}
          </div>

          <div className="px-8 pb-8">
            {/* Error banner */}
            {error && (
              <div className="mb-5 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600 flex items-start gap-2.5">
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* ── STEP 1: Enter email ── */}
            {step === STEP.EMAIL && (
              <>
                {/* Google */}
                {/* <button
                  onClick={handleGoogle}
                  disabled={googleBusy || busy}
                  className="w-full h-12 flex items-center justify-center gap-3 border border-gray-200 hover:border-[#281000] rounded-2xl text-sm font-medium text-[#281000] transition-all disabled:opacity-50 mb-5"
                >
                  {googleBusy
                    ? <div className="w-4 h-4 border-2 border-[#281000] border-t-transparent rounded-full animate-spin" />
                    : <><GoogleIcon />Continue with Google</>
                  }
                </button> */}

                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-xs text-gray-400">or use email</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>

                <form onSubmit={handleSendOtp} noValidate>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Email address
                  </label>
                  <input
                    type="email" value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full h-12 border border-gray-200 focus:border-[#281000] rounded-2xl px-4 outline-none text-[#281000] placeholder:text-gray-300 text-sm transition-colors"
                  />
                  <button
                    type="submit" disabled={busy || !email.trim()}
                    className="w-full mt-3 h-12 bg-[#281000] hover:bg-black text-white rounded-2xl text-sm font-semibold transition-all disabled:opacity-50"
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

                <p className="text-xs text-gray-300 mt-6 text-center leading-relaxed">
                  By continuing, you agree to our{' '}
                  <a href="/retail/terms" className="underline text-gray-400 hover:text-[#281000]">Terms</a>
                  {' '}&amp;{' '}
                  <a href="/retail/privacy" className="underline text-gray-400 hover:text-[#281000]">Privacy Policy</a>
                </p>
              </>
            )}

            {/* ── STEP 2: Enter OTP ── */}
            {step === STEP.OTP && (
              <>
                <form onSubmit={handleVerifyOtp} noValidate>
                  <div className="flex gap-2 mb-6" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { otpRefs.current[i] = el; }}
                        type="text" inputMode="numeric" pattern="\d*" maxLength={1} value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className={`flex-1 aspect-square text-center text-2xl font-bold border-2 rounded-xl outline-none transition-all
                          ${digit ? 'border-[#281000] bg-[#281000]/5 text-[#281000]' : 'border-gray-200 text-[#281000]'}
                          focus:border-[#281000]`}
                      />
                    ))}
                  </div>
                  <button
                    type="submit" disabled={busy || otp.join('').length < 6}
                    className="w-full h-12 bg-[#281000] hover:bg-black text-white rounded-2xl text-sm font-semibold transition-all disabled:opacity-50"
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

                <div className="mt-5 text-center">
                  {countdown > 0 ? (
                    <p className="text-sm text-gray-400">
                      Resend in <span className="font-semibold text-[#281000]">{countdown}s</span>
                    </p>
                  ) : (
                    <button
                      onClick={handleSendOtp} disabled={busy}
                      className="text-sm text-[#281000] underline hover:text-black disabled:opacity-50"
                    >
                      Resend code
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">ivara by Dada Exports</p>
      </div>
    </div>
  );
}

// ── Small helpers ─────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

export default function RetailLoginPage() {
  return <Suspense><LoginContent /></Suspense>;
}
