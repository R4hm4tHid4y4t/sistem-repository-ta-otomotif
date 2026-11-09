/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: { bodySizeLimit: "105mb" },
    proxyClientMaxBodySize: "105mb",
  },};
export default nextConfig;
