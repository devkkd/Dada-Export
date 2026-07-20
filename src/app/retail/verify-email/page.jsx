'use client';

import Link from 'next/link';

/**
 * NextAuth redirects here after sending the magic-link email.
 * (Configured via pages.verifyRequest in retailAuthOptions.js)
 */
export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-[#FFF7F2] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-[420px] p-10 shadow-xl text-center">

        <div className="w-16 h-16 mx-auto bg-[#281000]/10 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-[#281000]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h2 className="text-2xl font-medium text-[#281000] mb-3">Check your email</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-2">
          A sign-in link has been sent to your email address.
        </p>
        <p className="text-xs text-gray-400 leading-relaxed mb-8">
          The link expires in <strong>10 minutes</strong>. Check your spam folder if you don&apos;t see it.
        </p>

        <Link
          href="/retail/login"
          className="text-sm text-[#281000] underline hover:text-black"
        >
          ← Back to sign in
        </Link>
      </div>
    </div>
  );
}
