export type TodoPriority = 'low' | 'medium' | 'high';
export interface ITodo {
  id: string;
  text: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  priority: TodoPriority;
}
