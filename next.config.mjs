// @ts-check

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Development logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // Production builds
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
