/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
    },
    output: "export",  // <=== enables static exports
    reactStrictMode: true,
    env: {
        PUBLIC_API_KEY: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY,
    },
};

export default nextConfig;
