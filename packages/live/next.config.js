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
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
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
                path: false,
                os: false,
                crypto: false,
                stream: false,
                http: false,
                https: false,
                zlib: false,
            };
            config.plugins.push(
                new webpack.IgnorePlugin({
                    resourceRegExp: /^(tls|net|fs|http2|dns|child_process|path|os|crypto|stream|http|https|zlib)$/,
                })
            );
            config.plugins.push(
                new webpack.IgnorePlugin({
                    resourceRegExp: /(@farcaster\/hub-nodejs|@grpc\/grpc-js)/,
                })
            );
        }
        return config;
    },
}

module.exports = nextConfig
