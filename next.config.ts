import type { NextConfig } from "next";

// STATIC_EXPORT=1 npm run build -> plain static site in ./out (used for previews / simple hosting).
const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(process.env.STATIC_EXPORT === "1"
    ? { output: "export", trailingSlash: true, images: { unoptimized: true } }
    : {}),
};

export default nextConfig;
