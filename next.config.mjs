import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Clean up duplicate dynamic route to prevent Next.js build errors
const oldTicketDir = path.join(__dirname, 'src', 'app', 'ticket', '[id]');
if (fs.existsSync(oldTicketDir)) {
  try {
    fs.rmSync(oldTicketDir, { recursive: true, force: true });
    console.log('Cleaned up legacy ticket route:', oldTicketDir);
  } catch (e) {
    console.error('Failed to clean up legacy route:', e);
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      }
    ],
  },
};

export default nextConfig;
