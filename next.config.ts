import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: ["./src/styles"],
  },
  images: {
    domains: ["lh3.googleusercontent.com", "i.pravatar.cc"],
  },
};

export default nextConfig;
