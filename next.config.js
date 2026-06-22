// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Biar iframe embed bisa jalan
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: "frame-src *; frame-ancestors *;" },
        ],
      },
    ]
  },
}

module.exports = nextConfig
