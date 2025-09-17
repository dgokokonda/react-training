import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'c.dns-shop.ru',
        port: '',
        pathname: '/thumb/**',
      },
    ],
  },
};

export default nextConfig;
