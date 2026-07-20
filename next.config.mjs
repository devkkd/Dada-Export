import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        // Cloudflare R2 public bucket URL (r2.dev subdomain)
        protocol: 'https',
        hostname: '*.r2.dev',
      },
      {
        // Cloudflare custom domain (if configured)
        protocol: 'https',
        hostname: '*.cloudflarestorage.com',
      },
      {
        // Google profile photos (OAuth)
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
