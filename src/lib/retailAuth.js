import { SignJWT, jwtVerify } from 'jose';

const RETAIL_JWT_SECRET = new TextEncoder().encode(
  process.env.RETAIL_JWT_SECRET || 'retail-secret-change-in-prod-min-32-chars!!'
);

const COOKIE_NAME = 'retail_token';
const MAX_AGE    = 7 * 24 * 60 * 60; // 7 days in seconds

// ── Sign ─────────────────────────────────────────────────────────────────────
export async function signRetailToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(RETAIL_JWT_SECRET);
}

// ── Verify ───────────────────────────────────────────────────────────────────
export async function verifyRetailToken(token) {
  try {
    const { payload } = await jwtVerify(token, RETAIL_JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

// ── Cookie helpers ────────────────────────────────────────────────────────────
export function getTokenCookie(token) {
  return `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax${
    process.env.NODE_ENV === 'production' ? '; Secure' : ''
  }`;
}

export function clearTokenCookie() {
  return `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`;
}

export { COOKIE_NAME };
