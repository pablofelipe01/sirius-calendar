import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Ignora los errores de ESLint durante el build de producción
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;