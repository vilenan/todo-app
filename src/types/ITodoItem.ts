export interface ITodoItem {
  text: string;
  description?: string;
  dueDate?: string;
  id: string;
  completed: boolean;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDetails: (id: string) => void;
}
