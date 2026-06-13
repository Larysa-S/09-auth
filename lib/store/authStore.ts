import { create } from 'zustand';
import { User } from '@/types/user';

// 📝 Описуємо інтерфейс для нашого Zustand-стору за вимогами ТЗ
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearIsAuthenticated: () => void;
}

// 🚀 Створюємо стор із подвійними дужками для коректного визначення типів у TypeScript
const useAuthStore = create<AuthStore>()(set => ({
  user: null,
  isAuthenticated: false,

  // Метод для запису даних користувача після успішного логіну або реєстрації
  setUser: (user: User) =>
    set({
      user,
      isAuthenticated: true,
    }),

  // Метод для очищення стану під час виходу з системи (logout)
  clearIsAuthenticated: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));

export default useAuthStore;
