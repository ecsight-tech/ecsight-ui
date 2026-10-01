import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Solar style entry points are barrels of ~1,450 icons each
    optimizePackageImports: ["@solar-icons/react"],
  },
};

export default nextConfig;
