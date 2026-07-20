import { NextResponse } from 'next/server';

const NOMINATIM = 'https://nominatim.openstreetmap.org/reverse';
const OPENCAGE = 'https://api.opencagedata.com/geocode/v1/json';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    if (!lat || !lon) return NextResponse.json({ success: false, message: 'lat and lon required' }, { status: 400 });

    // Prefer a contact email from env for Nominatim User-Agent per their policy
    const contact = process.env.GEO_CONTACT_EMAIL || process.env.SMTP_USER || 'dev@dadaexports.example';
    const userAgent = `ivara-by-dada-exports/1.0 (${contact})`;

    const url = `${NOMINATIM}?format=json&addressdetails=1&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;

    const res = await fetch(url, {
      headers: {
        'User-Agent': userAgent,
        'Accept-Language': 'en'
      }
    });

    if (!res.ok) {
      const text = await res.text().catch(() => 'no-body');
      console.error('[geo/reverse] Nominatim error', { status: res.status, body: text });

      // If OpenCage key is provided, try fallback to OpenCage geocoding
      const openCageKey = process.env.OPENCAGE_API_KEY;
      if (openCageKey) {
        try {
          const ocRes = await fetch(`${OPENCAGE}?q=${encodeURIComponent(lat + ',' + lon)}&key=${openCageKey}&language=en&no_annotations=1`);
          if (ocRes.ok) {
            const ocJson = await ocRes.json();
            if (ocJson && Array.isArray(ocJson.results) && ocJson.results.length > 0) {
              // map OpenCage response into a similar shape as Nominatim
              const components = ocJson.results[0].components || {};
              const data = { address: components, raw: ocJson.results[0] };
              return NextResponse.json({ success: true, data });
            }
          } else {
            const text = await ocRes.text().catch(() => 'no-body');
            console.error('[geo/reverse] OpenCage error', { status: ocRes.status, body: text });
          }
        } catch (e) {
          console.error('[geo/reverse] OpenCage fetch failed', e.message || e);
        }
      }

      return NextResponse.json({ success: false, message: 'Geocoding upstream error', status: res.status, body: text }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('[geo/reverse] unexpected error', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
