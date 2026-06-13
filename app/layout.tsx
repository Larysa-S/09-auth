import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import '@/app/globals.css';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import AuthProvider from '@/components/AuthProvider/AuthProvider';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: {
    template: '%s | NoteHub',
    default: 'NoteHub — Розумний менеджер ваших нотаток',
  },
  description:
    'Зберігайте свої думки, структуруйте завдання та керуйте нотатками в реальному часі за допомогою NoteHub.',
  openGraph: {
    title: 'NoteHub — Розумний менеджер ваших нотаток',
    description:
      'Зберігайте свої думки та керуйте нотатками за допомогою сучасного стеку технологій.',
    type: 'website',
    siteName: 'NoteHub',
    // 🚀 ТИМЧАСОВО ВИПРАВЛЕНО: Використовуємо системну змінну або базовий URL.
    // Після деплою hw-09 сюди можна буде вставити нове посилання.
    url: process.env.NEXT_PUBLIC_API_URL || 'https://goit.global',
    images: [
      {
        url: 'https://goit.global',
        width: 1200,
        height: 630,
        alt: 'NoteHub Preview',
      },
    ],
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
  modal?: React.ReactNode;
}

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${roboto.className} ${roboto.variable}`}>
        <TanStackProvider>
          <AuthProvider>
            <Header />

            {children}
            {modal}

            <Footer />
          </AuthProvider>
        </TanStackProvider>
        {/* 🚀 ВИПРАВЛЕНО: Видалено не потрібний у Next.js App Router <div id="modal-root"> */}
      </body>
    </html>
  );
}
