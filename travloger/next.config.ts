// Next.js configuration
// Allows loading remote images from CMS-provided URLs
const nextConfig = {
  images: {
    // Either use domains or remotePatterns. remotePatterns is more explicit.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.istockphoto.com',
      },
      // Add other hosts your CMS may return (optional, safe defaults)
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      },
    ],
  },
};

export default nextConfig;


