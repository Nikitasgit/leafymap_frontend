import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: ["./src/styles"],
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
