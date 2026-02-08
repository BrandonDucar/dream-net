const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@dreamnet/shared'],
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    webpack: (config, { isServer, webpack }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                tls: false,
                net: false,
                fs: false,
                http2: false,
                dns: false,
                child_process: false,
            };
            config.plugins.push(
                new webpack.IgnorePlugin({
                    resourceRegExp: /(@farcaster\/hub-nodejs|@grpc\/grpc-js|http2|tls|fs|net|dns|child_process)/,
                })
            );
            config.externals = {
                ...config.externals,
                'tls': 'tls',
                'net': 'net',
                'fs': 'fs',
                'http2': 'http2',
            };

            // SWARM STRATEGY ALPHA: Alias to explicit mock file
            config.resolve.alias = {
                ...config.resolve.alias,
                'porto': path.resolve(__dirname, 'mocks/porto.js'),
            };
        }
        return config;
    },
}

module.exports = nextConfig
