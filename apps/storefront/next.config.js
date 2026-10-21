/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@marketplace/shared-ui"],
  experimental: {
    allowedDevOrigins: ["marketplace.local", "*.marketplace.local"],
  },
}

module.exports = nextConfig
