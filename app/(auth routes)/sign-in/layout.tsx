import React from 'react';

interface SignInLayoutProps {
  children: React.ReactNode;
}

export default function SignInLayout({ children }: SignInLayoutProps) {
  return (
    <>
      {/* Тут може бути ваш спільний дизайн для сторінки входу */}
      {children}
    </>
  );
}
