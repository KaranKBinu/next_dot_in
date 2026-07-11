import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Expose these env vars to Edge runtime (middleware)
  env: {
    ADMIN_SESSION_TOKEN: process.env.ADMIN_SESSION_TOKEN ?? "",
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ?? "",
  },
};

export default nextConfig;
