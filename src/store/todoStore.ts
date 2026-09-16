import { create } from 'zustand';
import { API_URL } from '../config/api';
import type { ITodo, TodoPriority } from '../types/ITodo';
import { useAuthStore } from './authStore';

export type AddTodoPayload = {
  text: string;
  description?: string;
  dueDate?: string;
  priority?: TodoPriority;
};

export type UpdateTodoPayload = {
  id: string;
  text: string;
  description?: string;
  dueDate?: string;
  priority?: TodoPriority;
};

type TodosStore = {
  todos: ITodo[];
  fetchTodos: () => Promise<void>;
  addTodo: (payload: AddTodoPayload) => Promise<void>;
  updateTodo: (payload: UpdateTodoPayload) => Promise<void>;
  removeTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  clearCompleted: () => Promise<void>;
};

function getAuthHeaders() {
  const token = useAuthStore.getState().token;

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

async function fetchWithRefresh(
  url: string,
  init: Omit<RequestInit, 'headers'> = {}
) {
  let response = await fetch(url, {
    ...init,
    credentials: 'include',
    headers: getAuthHeaders(),
  });

  if (response.status === 401) {
    try {
      await useAuthStore.getState().refreshAccessToken();
    } catch {
      useAuthStore.getState().logout();
      window.location.assign('/login');
      throw new Error('Сессия истекла. Выполните вход снова.');
    }

    response = await fetch(url, {
      ...init,
      credentials: 'include',
      headers: getAuthHeaders(),
    });

    if (response.status === 401) {
      useAuthStore.getState().logout();
      window.location.assign('/login');
      throw new Error('Сессия истекла. Выполните вход снова.');
    }
  }

  return response;
}

export const useTodos = create<TodosStore>()((set, get) => ({
  todos: [],

  fetchTodos: async () => {
    const response = await fetchWithRefresh(`${API_URL}/todos`);

    if (!response.ok) {
      throw new Error('Не удалось загрузить задачи');
    }
    const todos: ITodo[] = await response.json();
    set({ todos });
  },

  addTodo: async ({ text, description, dueDate, priority }) => {
    const response = await fetchWithRefresh(`${API_URL}/todos`, {
      method: 'POST',
      body: JSON.stringify({
        text,
        description,
        dueDate,
        priority,
      }),
    });

    if (!response.ok) {
      throw new Error('Не удалось создать задачу');
    }

    const createTodo: ITodo = await response.json();

    set((state) => ({
      todos: [createTodo, ...state.todos],
    }));
  },

  updateTodo: async ({ id, text, description, dueDate, priority }) => {
    const response = await fetchWithRefresh(`${API_URL}/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        text,
        description,
        dueDate,
        priority,
      }),
    });

    if (!response.ok) {
      throw new Error('Не удалось обновить задачу');
    }

    const updatedTodo: ITodo = await response.json();

    set((state) => ({
      todos: state.todos.map((todo) => (todo.id === id ? updatedTodo : todo)),
    }));
  },

  removeTodo: async (id) => {
    const response = await fetchWithRefresh(`${API_URL}/todos/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Не удалось удалить задачу');
    }

    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    }));
  },

  toggleTodo: async (id) => {
    const todo = get().todos.find((todo) => todo.id === id);
    if (!todo) return;

    const response = await fetchWithRefresh(`${API_URL}/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        completed: !todo.completed,
      }),
    });

    if (!response.ok) {
      throw new Error('Не удалось изменить статус задачи');
    }

    const updatedTodo: ITodo = await response.json();

    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: updatedTodo.completed } : todo
      ),
    }));
  },

  clearAll: async () => {
    const todos = get().todos;
    await Promise.all(
      todos.map((todo) => {
        fetchWithRefresh(`${API_URL}/todos/${todo.id}`, {
          method: 'DELETE',
        });
      })
    );
    set({ todos: [] });
  },

  clearCompleted: async () => {
    const completedTodos = get().todos.filter((todo) => todo.completed);
    if (completedTodos.length === 0) return;
    await Promise.all(
      completedTodos.map((todo) => {
        fetchWithRefresh(`${API_URL}/todos/${todo.id}`, {
          method: 'DELETE',
        });
      })
    );

    set((state) => ({
      todos: state.todos.filter((todo) => !todo.completed),
    }));
  },
}));
