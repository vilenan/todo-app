import { create } from 'zustand';
import { API_URL } from '../config/api';

type User = {
  id: string;
  email: string;
};

type AuthResponse = {
  accessToken: string;
  user: User;
};

type AuthStore = {
  user: User | null;
  token: string | null;
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
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  initAuth: async () => {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');

    if (!token || !userJson) {
      set({ user: null, token: null, isAuthenticated: false });
      return;
    }

    set({
      token,
      user: JSON.parse(userJson),
      isAuthenticated: true,
    });
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error();
      }
      const data: AuthResponse = await response.json();

      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      set({
        token: data.accessToken,
        user: data.user,
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
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error();
      }

      const data: AuthResponse = await response.json();

      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      set({
        user: data.user,
        token: data.accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      set({
        error: 'Пользователь с такими данными уже есть',
        isLoading: false,
      });
      return;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));
