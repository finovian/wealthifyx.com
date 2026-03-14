import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/tools/sip-calculator',
        destination: '/tools',
        permanent: true, // 301 redirect
      },
      {
        source: '/tools/stock-return',
        destination: '/tools',
        permanent: true,
      },
    ];
  },
  /* config options here */
};

export default nextConfig;
