import { useCallback, useReducer, type ReactNode } from 'react';
import {
  initialTodosState,
  todosReducer,
  type AddTodoPayload,
  type UpdateTodoPayload,
} from './todosReducer';
import { TodosContext } from './TodosContextInstance';

function useTodosState() {
  const [state, dispatch] = useReducer(todosReducer, initialTodosState);

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
