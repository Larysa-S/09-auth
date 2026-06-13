import axios from 'axios';

// 🚀 ВИПРАВЛЕНО: Формуємо baseURL за чіткою інструкцією з ТЗ.
// На сервері підставиться повний URL (наприклад, http://localhost:3000/api),
// а на клієнті Next.js успішно відпрацює в обох варіантах.
const baseURL = (process.env.NEXT_PUBLIC_API_URL || '') + '/api';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Критично для передачі cookies
});
