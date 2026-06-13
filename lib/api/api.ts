import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL,
  withCredentials: true, // Критично для передачі кук
});

export default api;
