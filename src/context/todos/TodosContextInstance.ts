import { createContext } from 'react';
import type { ITodo } from '../../types/ITodo';
import type { AddTodoPayload, UpdateTodoPayload } from './todosReducer';

export type TodosContextValue = {
  todos: ITodo[];
  addTodo: (payload: AddTodoPayload) => void;
  updateTodo: (payload: UpdateTodoPayload) => void;
  removeTodo: (id: number) => void;
  toggleTodo: (id: number) => void;
  clearAll: () => void;
  clearCompleted: () => void;
};

export const TodosContext = createContext<TodosContextValue | null>(null);
