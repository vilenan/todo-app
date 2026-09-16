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
  refreshAccessToken: () => Promise<string>;
  login: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    passwordConfirm: string
  ) => Promise<void>;
  logout: () => void;
  clearError: () => void;
};

let initAuthPromise: Promise<void> | null = null;
let refreshAccessTokenPromise: Promise<string> | null = null;

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  refreshAccessToken: async () => {
    if (refreshAccessTokenPromise) {
      return refreshAccessTokenPromise;
    }

    refreshAccessTokenPromise = (async () => {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Не удалось обновить access token');
      }

      const data: AuthResponse = await response.json();
      set({
        token: data.accessToken,
        user: data.user,
        isAuthenticated: true,
      });
      return data.accessToken;
    })();

    try {
      return await refreshAccessTokenPromise;
    } finally {
      refreshAccessTokenPromise = null;
    }
  },

  initAuth: async () => {
    if (initAuthPromise) {
      return initAuthPromise;
    }

    initAuthPromise = (async () => {
      set({ isLoading: true, error: null });

      try {
        await get().refreshAccessToken();
        set({ isLoading: false });
      } catch {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    })();

    try {
      await initAuthPromise;
    } finally {
      initAuthPromise = null;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error();
      }
      const data: AuthResponse = await response.json();

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
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error();
      }

      const data: AuthResponse = await response.json();

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
    void fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

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
