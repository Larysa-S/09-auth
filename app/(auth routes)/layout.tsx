'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // 🚀 ВИПРАВЛЕНО: Імпортуємо useRouter для клієнтської навігації

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();

  // 🚀 ВИПРАВЛЕНО: Додано клієнтську логіку виклику router.refresh() при монтуванні
  useEffect(() => {
    router.refresh();
  }, [router]);

  return <>{children}</>;
}
