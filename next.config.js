/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "http2.mlstatic.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.mlstatic.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
    ],
    formats: ["image/webp", "image/avif"],
  },
  // Compresión
  compress: true,
  // Headers de seguridad
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
    ]
  },
  // Redirects www → sin www
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.tiendaosvaldo.com.ar" }],
        destination: "https://tiendaosvaldo.com.ar/:path*",
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
