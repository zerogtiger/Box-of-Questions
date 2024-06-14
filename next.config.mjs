/** @type {import('next').NextConfig} */
const nextConfig = {
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
