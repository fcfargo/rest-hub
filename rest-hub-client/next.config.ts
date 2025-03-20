import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com', 'rest-hub-bucket.s3.ap-northeast-2.amazonaws.com'],
  },
};

export default nextConfig;
