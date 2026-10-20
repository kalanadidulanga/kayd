/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
  // Every old public URL lands on its new home. Experience and Skills were
  // merged into About; projects moved from /experience to /work earlier.
  async redirects() {
    return [
      { source: "/experience", destination: "/about", permanent: true },
      { source: "/experience/:id", destination: "/work/:id", permanent: true },
      { source: "/skills", destination: "/about#skills", permanent: true },
      { source: "/educations", destination: "/about#education", permanent: true },
      { source: "/contributions", destination: "/about#contributions", permanent: true },
      // An old link Google still had on file.
      { source: "/index.html", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
