import { create } from 'zustand';
import type { ITodo, TodoPriority } from '../types/ITodo';
import { pb } from '../lib/pocketbase';

export type AddTodoPayload = {
  userId: string;
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
  fetchTodos: (userId: string) => Promise<void>;
  addTodo: (payload: AddTodoPayload) => Promise<void>;
  updateTodo: (payload: UpdateTodoPayload) => Promise<void>;
  removeTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  clearCompleted: () => Promise<void>;
};

export const useTodos = create<TodosStore>()((set, get) => ({
  todos: [],

  fetchTodos: async (userId: string) => {
    const records = await pb
      .collection('todos')
      .getFullList({ filter: `user = "${userId}"` });

    set({
      todos: records.map((record) => ({
        id: record.id,
        text: record.text,
        description: record.description,
        completed: record.completed,
        dueDate: record.dueDate,
        priority: record.priority,
      })),
    });
  },

  addTodo: async ({ text, description, dueDate, userId, priority }) => {
    const record = await pb.collection('todos').create({
      user: userId,
      text,
      description,
      dueDate,
      completed: false,
      priority,
    });
    set((state) => ({
      todos: [
        ...state.todos,
        {
          id: record.id,
          text: record.text,
          description: record.description,
          dueDate: record.dueDate,
          completed: record.completed,
          priority: record.priority,
        },
      ],
    }));
  },

  updateTodo: async ({ id, text, description, dueDate, priority }) => {
    const updatedTodo = await pb.collection('todos').update(id, {
      text: text,
      description: description,
      dueDate: dueDate,
      priority: priority,
    });

    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              text: updatedTodo.text,
              description: updatedTodo.description,
              dueDate: updatedTodo.dueDate,
              priority: updatedTodo.priority,
            }
          : todo
      ),
    }));
  },

  removeTodo: async (id) => {
    await pb.collection('todos').delete(id);
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    }));
  },

  toggleTodo: async (id) => {
    const todo = get().todos.find((todo) => todo.id === id);
    if (!todo) return;

    const updatedTodo = await pb
      .collection('todos')
      .update(id, { completed: !todo.completed });

    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: updatedTodo.completed } : todo
      ),
    }));
  },

  clearAll: async () => {
    const todos = get().todos;
    await Promise.all(
      todos.map((todo) => pb.collection('todos').delete(todo.id))
    );
    set({ todos: [] });
  },

  clearCompleted: async () => {
    const completedTodos = get().todos.filter((todo) => todo.completed);
    if (completedTodos.length === 0) return;
    await Promise.all(
      completedTodos.map((todo) => pb.collection('todos').delete(todo.id))
    );

    set((state) => ({
      todos: state.todos.filter((todo) => !todo.completed),
    }));
  },
}));
