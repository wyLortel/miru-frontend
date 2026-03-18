import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: "/me",
        destination: `${backendUrl}/me`,
      },
      {
        source: "/logout",
        destination: `${backendUrl}/logout`,
      },
    ];
  },
};

export default nextConfig;
