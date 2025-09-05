/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: '.next',
  output: 'standalone',
  experimental: {
    // Disable static optimization for auth-related pages
    scrollRestoration: true,
  },
  // Export configuration for static builds
  trailingSlash: true,
  generateBuildId: () => 'build',
};

module.exports = nextConfig;
