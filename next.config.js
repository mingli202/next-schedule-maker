/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      path: false,
    };
    return config;
  },
  env: {
    URL:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://github.com/Nanoscience202/next-schedule-maker",
  },
  experimental: {
    // windowHistorySupport: true,
  },
};

module.exports = nextConfig;
