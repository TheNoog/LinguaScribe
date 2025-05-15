
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
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      // Prevent `async_hooks` from being bundled for the client
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}), // Spread existing fallbacks
        async_hooks: false, // Resolves 'async_hooks' to false (an empty module) for client builds
      };
    }
    // Add rule to handle .node files if genkit/google-vertex-ai uses them and they cause issues
    // This is a common pattern for native Node.js addons
    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
    });
    return config;
  },
};

export default nextConfig;
