/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build enxuto para Docker: gera um servidor mínimo auto-contido (.next/standalone).
  output: "standalone",
  reactStrictMode: true,
};

export default nextConfig;
