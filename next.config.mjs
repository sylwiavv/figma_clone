/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        remotePatterns: [{
            protocol: "https",
            hostname: "liveblocks.io",
            port: ""
        }]
    },
    output: "export",  // <=== enables static exports
    reactStrictMode: true,
    env: {
        PUBLIC_API_KEY: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY,
    },
};

export default nextConfig;
