
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Prevent `async_hooks` from being bundled for the client
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}), // Spread existing fallbacks
        async_hooks: false, // Resolves 'async_hooks' to false (an empty module) for client builds
      };
    }
    return config;
  },
};

export default nextConfig;
