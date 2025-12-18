/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.arabella.uz',
      },
      {
        protocol: 'http',
        hostname: 'api.arabella.uz',
      },
      {
        protocol: 'https',
        hostname: 'nanobanana.uz',
      },
      {
        protocol: 'http',
        hostname: 'nanobanana.uz',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
    unoptimized: true, // Disable image optimization to show images directly
  },
};

export default nextConfig;

