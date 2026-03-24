/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  output: "standalone",
  images: {
    unoptimized: true,
  },
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
    buildActivityPosition: 'bottom-right',
  },
  serverExternalPackages: ['@prisma/client'],
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  }
}

export default nextConfig
