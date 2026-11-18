import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // three.js ships ESM that Next can bundle directly
  transpilePackages: ["three"],
};

export default nextConfig;
