import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The gallery moved under /docs when the landing page took over /
  async redirects() {
    return [
      { source: "/components/:slug", destination: "/docs/components/:slug", permanent: true },
      { source: "/blocks/:slug", destination: "/docs/blocks/:slug", permanent: true },
    ];
  },
  experimental: {
    // Solar style entry points are barrels of ~1,450 icons each
    optimizePackageImports: ["@solar-icons/react"],
  },
};

export default nextConfig;
