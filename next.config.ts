import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Google profile photos (OAuth)
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      // GitHub avatars
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      // Unsplash (product images on home page)
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
