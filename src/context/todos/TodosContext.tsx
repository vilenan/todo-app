import { useCallback, useEffect, useReducer, type ReactNode } from 'react';
import type { ITodo } from '../../types/ITodo';
import {
  initialTodosState,
  todosReducer,
  type AddTodoPayload,
  type UpdateTodoPayload,
} from './todosReducer';
import { TodosContext } from './TodosContextInstance';

const TODOS_STORAGE_KEY = 'todos';

function readTodosFromStorage(): ITodo[] {
  try {
    const raw = localStorage.getItem(TODOS_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function useTodosState() {
  const [state, dispatch] = useReducer(
    todosReducer,
    initialTodosState,
    (baseState) => ({
      ...baseState,
      todos: readTodosFromStorage(),
    })
  );

  useEffect(() => {
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(state.todos));
  }, [state.todos]);

  const addTodo = useCallback((payload: AddTodoPayload) => {
    dispatch({ type: 'ADD_TODO', payload });
  }, []);

  const updateTodo = useCallback((payload: UpdateTodoPayload) => {
    dispatch({ type: 'UPDATE_TODO', payload });
  }, []);

  const removeTodo = useCallback((id: number) => {
    dispatch({ type: 'REMOVE_TODO', payload: { id } });
  }, []);

  const toggleTodo = useCallback((id: number) => {
    dispatch({ type: 'TOGGLE_TODO', payload: { id } });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  const clearCompleted = useCallback(() => {
    dispatch({ type: 'CLEAR_COMPLETED' });
  }, []);

  return {
    todos: state.todos,
    addTodo,
    updateTodo,
    removeTodo,
    toggleTodo,
    clearAll,
    clearCompleted,
  };
}

export function TodosProvider({ children }: { children: ReactNode }) {
  const value = useTodosState();

  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
}
