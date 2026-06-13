import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 🚀 Увімкнення React Compiler з вашого першого конфігу
  reactCompiler: true,

  // 🖼️ Налаштування для завантаження аватарок з бекенду GoIT за ТЗ
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ac.goit.global',
      },
    ],
  },
};

export default nextConfig;
