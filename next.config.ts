import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: [path.resolve(process.cwd(), "src")],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "linkal.s3.eu-west-3.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
