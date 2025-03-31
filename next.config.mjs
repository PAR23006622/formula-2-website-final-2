/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            // Don't attempt to load these server-only modules on the client
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                path: false,
                http: false,
                https: false,
                net: false,
                tls: false,
                child_process: false,
            };
        }
        return config;
    },
};

export default nextConfig; 