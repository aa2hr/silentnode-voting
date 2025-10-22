/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Ensure global polyfill runs before other bundles
    config.entry = async () => {
      const entries = await config.entry();
      if (entries["main-app"]) {
        entries["main-app"].unshift("./polyfills/global.js");
      } else if (entries["main"]) {
        entries["main"].unshift("./polyfills/global.js");
      }
      return entries;
    };

    return config;
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  experimental: { esmExternals: "loose" },
};

export default nextConfig;

