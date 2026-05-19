import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ITodo } from '../types/ITodo';

export type AddTodoPayload = {
  text: string;
  description?: string;
  dueDate?: string;
};

export type UpdateTodoPayload = {
  id: number;
  text: string;
  description?: string;
  dueDate?: string;
};

type TodosStore = {
  todos: ITodo[];
  addTodo: (payload: AddTodoPayload) => void;
  updateTodo: (payload: UpdateTodoPayload) => void;
  removeTodo: (id: number) => void;
  toggleTodo: (id: number) => void;
  clearAll: () => void;
  clearCompleted: () => void;
};

export const useTodos = create<TodosStore>()(
  persist(
    (set) => ({
      todos: [],

      addTodo: ({ text, description, dueDate }) =>
        set((state) => ({
          todos: [
            ...state.todos,
            {
              id: Date.now(),
              text,
              description,
              dueDate,
              completed: false,
            },
          ],
        })),

      updateTodo: ({ id, text, description, dueDate }) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, text, description, dueDate } : todo
          ),
        })),

      removeTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),

      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        })),

      clearAll: () => set({ todos: [] }),

      clearCompleted: () =>
        set((state) => ({
          todos: state.todos.filter((todo) => !todo.completed),
        })),
    }),
    {
      name: 'todos',
    }
  )
);
