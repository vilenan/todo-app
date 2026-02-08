export interface ITodoItem {
  text: string;
  description?: string;
  dueDate?: string;
  id: number;
  completed: boolean;
  onRemove: (id: number) => void;
  onToggle: (id: number) => void;
  onEdit: (id: number) => void;
}
