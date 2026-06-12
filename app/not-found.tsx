import type { Metadata } from 'next';
import { NotFoundClient } from './not-found-client';

// 🚀 Вимога ментора: експорт об’єкта metadata та Open Graph для сторінки 404
export const metadata: Metadata = {
  title: 'Сторінку не знайдено',
  description:
    'На жаль, такої сторінки не існує або вона була перенесена. Ви будете автоматично перенаправлені на головну сторінку.',
  openGraph: {
    title: '404 - Сторінку не знайдено | NoteHub',
    description: 'Запитуваної сторінки не існує на NoteHub. Поверніться на головну.',
    url: 'https://vercel.app', // Вкажіть посилання на ваш майбутній проєкт Vercel
    images: [
      {
        // 🚀 ВИПРАВЛЕНО: встановлено обов'язкове зображення строго за ТЗ ментора
        url: 'https://goit.global',
      },
    ],
  },
};

export default function NotFoundPage() {
  // Рендеримо чисту клієнтську логіку з таймером всередині сторінки з SEO
  return <NotFoundClient />;
}
