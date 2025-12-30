/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable Turbopack to avoid tmp directory issues on Vercel
  turbopack: false,
};

module.exports = nextConfig;
