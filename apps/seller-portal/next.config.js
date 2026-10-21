/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@marketplace/shared-ui"],
  experimental: {
    allowedDevOrigins: ["seller.marketplace.local", "*.marketplace.local"],
  },
}

module.exports = nextConfig
