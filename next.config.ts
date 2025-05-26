import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: ["./src/styles"],
  },
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "i.pravatar.cc",
      "linkal.s3.eu-west-3.amazonaws.com",
    ],
  },
};

export default nextConfig;
