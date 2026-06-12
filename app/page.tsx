import type { Metadata } from 'next';
import Link from 'next/link';
import css from './page.module.css';

// 🌐 Статичні метадані для головної сторінки.
export const metadata: Metadata = {
  title: 'Welcome',
  description:
    'NoteHub is a simple and efficient application designed for managing personal notes. Keep your thoughts organized.',
  openGraph: {
    title: 'Welcome to NoteHub',
    description: 'Manage your personal notes efficiently in one place.',
    type: 'website',
    images: [
      {
        url: 'https://goit.global', // Наше перевірене OG за ТЗ
      },
    ],
  },
};

export default function HomePage() {
  return (
    <main>
      <div className={css.container}>
        <h1 className={css.title}>Welcome to NoteHub</h1>
        <p className={css.description}>
          NoteHub is a simple and efficient application designed for managing personal notes. It
          helps keep your thoughts organized and accessible in one place, whether you are at home or
          on the go.
        </p>
        <p className={css.description}>
          The app provides a clean interface for writing, editing, and browsing notes. With support
          for keyword search and structured organization, NoteHub offers a streamlined experience
          for anyone who values clarity and productivity.
        </p>

        <div className={css.actions}>
          {/* 🚀 ВИПРАВЛЕНО: Прописано точний і прямий шлях до вашої робочої сторінки нотаток */}
          <Link href="/notes/filter/all" className={css.button}>
            Go to My Notes
          </Link>
        </div>
      </div>
    </main>
  );
}
