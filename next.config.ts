import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false

    config.resolve.alias.encoding = false

    return config
  },
  images: {
    // allow external images from placehold.co used for placeholders/logos
    domains: ['placehold.co']
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api'
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`
      }
    ]
  }
}

export default nextConfig
