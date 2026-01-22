import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Static export for Netlify
  output: 'export',

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
