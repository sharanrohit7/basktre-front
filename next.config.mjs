/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel runs Next natively (Route Handlers, SSR). Do not use output: "export".
  // Optional for Docker: output: "standalone",

  images: {
    remotePatterns: [
      // { protocol: "https", hostname: "cdn.example.com" },
    ]
  }
};

export default nextConfig;
