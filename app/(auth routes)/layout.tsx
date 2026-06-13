import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

// 🚀 Назва компонента універсальна для всієї групи авторизації
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      {/* Спільна обгортка для сторінок входу (sign-in) та реєстрації (sign-up) */}
      {children}
    </>
  );
}
