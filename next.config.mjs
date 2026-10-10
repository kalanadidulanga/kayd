/** @type {import('next').NextConfig} */
const nextConfig = {
  // Projects moved from /experience to /work, and education and
  // contributions folded into /experience. Old links keep working.
  async redirects() {
    return [
      { source: "/experience/:id", destination: "/work/:id", permanent: true },
      { source: "/educations", destination: "/experience#education", permanent: true },
      { source: "/contributions", destination: "/experience#contributions", permanent: true },
    ];
  },
};

export default nextConfig;
