import { create } from 'zustand';
import { pb } from '../lib/pocketbase';

type User = {
  id: string;
  email: string;
};

type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  initAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    passwordConfirm: string
  ) => Promise<void>;
  logout: () => void;
  clearError: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  initAuth: async () => {
    set({ isLoading: true });
    if (pb.authStore.isValid) {
      set({
        user: {
          id: pb.authStore.record?.id ?? '',
          email: pb.authStore.record?.email ?? '',
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      pb.authStore.clear();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      await pb.collection('users').authWithPassword(email, password);
      set({
        user: {
          id: pb.authStore.record?.id ?? '',
          email: pb.authStore.record?.email ?? '',
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      set({
        isLoading: false,
        error: 'Не удалось войти. Проверьте email и пароль.',
      });
    }
  },

  signUp: async (email, password, confirmPassword) => {
    set({ isLoading: true, error: null });
    if (password !== confirmPassword) {
      set({ isLoading: false, error: 'пароли не совпадают' });
      return;
    }
    try {
      await pb.collection('users').create({
        email: email,
        password: password,
        passwordConfirm: confirmPassword,
      });
    } catch {
      set({
        error: 'Пользователь с такими данными уже есть',
        isLoading: false,
      });
      return;
    }

    await pb.collection('users').authWithPassword(email, password);
    set({
      user: {
        id: pb.authStore.record?.id ?? '',
        email: pb.authStore.record?.email ?? '',
      },
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: () => {
    pb.authStore.clear();
    set({ user: null, isAuthenticated: false, error: null, isLoading: false });
  },

  clearError: () => {
    set({ error: null });
  },
}));
