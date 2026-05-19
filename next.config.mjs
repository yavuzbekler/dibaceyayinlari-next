/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  poweredByHeader: false,
  images: {
    unoptimized: true
  },
  cacheMaxMemorySize: 0,
  allowedDevOrigins: ["testdibaceyayinlari.xoka.com"]
};

export default nextConfig;
