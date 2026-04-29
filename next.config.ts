import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    const crm = process.env.CRM_API_URL || "http://localhost:3001";
    return [
      {
        source: "/uploads/:path*",
        destination: `${crm}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
