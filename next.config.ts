import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Inline route CSS into the HTML so the first visit does not wait on a
  // chain of render-blocking stylesheets (the main LCP delay on slow mobile).
  experimental: {
    inlineCss: true,
  },
  sassOptions: {
    includePaths: [path.resolve(process.cwd(), "src")],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "linkal.s3.eu-west-3.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
