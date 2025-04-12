import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  //TODO: Remove this
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
