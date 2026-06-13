import axios from 'axios';

// 🚀 ВИПРАВЛЕНО ДЛЯ КЛІЄНТА: Клієнтські запити мають іти на локальний проксі-шар /api вашого Next.js
// На локалці це перетвориться на http://localhost:3000/api
const baseURL = '/api';

export const api = axios.create({
  baseURL,
  withCredentials: true, // Критично для передачі кук
});

export default api;
