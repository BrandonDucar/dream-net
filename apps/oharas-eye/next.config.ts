import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@dreamnet/shared"],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
