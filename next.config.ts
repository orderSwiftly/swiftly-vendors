// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "i.pravatar.cc",
            },
        ],
    },
    // Optional: Proxy for development to avoid CORS
    async rewrites() {
        return [
            {
                source: '/webpush/:path*',
                destination: 'https://swiftly-sellers-api.onrender.com/webpush/:path*',
            },
        ];
    },
    async headers() {
        return [
            {
                source: '/web-push-service-worker.js',
                headers: [
                    {
                        key: 'Service-Worker-Allowed',
                        value: '/',
                    },
                    {
                        key: 'Content-Type',
                        value: 'application/javascript',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;