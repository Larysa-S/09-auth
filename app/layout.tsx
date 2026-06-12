import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import '@/app/globals.css';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-roboto',
});

// 🚀 ПОВНЕ ВИПРАВЛЕННЯ ЗАУВАЖЕННЯ МЕНТОРА
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
    // 🔥 додано канонічний url застосунку
    url: 'https://08-zustand-larysa-s-projects-0c81aa0e.vercel.app',
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
          <Header />
          {children}
          {modal}
          <Footer />
        </TanStackProvider>
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
