/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Artwork from fanart.tv. Their CDN serves everything from assets.fanart.tv;
    // images.fanart.tv shows up on some older records.
    remotePatterns: [
      { protocol: "https", hostname: "assets.fanart.tv" },
      { protocol: "https", hostname: "images.fanart.tv" },
    ],
  },
};

export default nextConfig;
