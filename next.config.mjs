/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-store',
        },
      ],
    },
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dnhoekqobkzsgyxzgidp.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/user_pfp/*',
      },
    ],
  },
}

export default nextConfig;
