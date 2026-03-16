import { useContext } from 'react';
import { TodosContext } from './TodosContextInstance';

export function useTodos() {
  const context = useContext(TodosContext);
  if (!context) {
    throw new Error('useTodos must be used within TodosProvider');
  }
  return context;
}
