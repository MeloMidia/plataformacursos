import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'player.pandavideo.com.br',
      },
      {
        protocol: 'https',
        hostname: 'static.pandavideo.com.br',
      },
    ],
  },
}

export default nextConfig
