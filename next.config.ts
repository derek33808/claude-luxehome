import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    unoptimized: true, // For static export
  },

  // Experimental features
  experimental: {
    reactCompiler: false,
  },
}

export default nextConfig
