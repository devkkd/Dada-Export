import { NextResponse } from 'next/server';

// Redirect any /api/retail/auth/error requests to the configured retail
// login page so users see a friendly login/error screen instead of a 404.
export async function GET(request) {
  const url = new URL(request.url);
  url.pathname = '/retail/login';
  return NextResponse.redirect(url);
}

export async function POST(request) {
  const url = new URL(request.url);
  url.pathname = '/retail/login';
  return NextResponse.redirect(url);
}
