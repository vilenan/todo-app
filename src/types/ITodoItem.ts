export interface ITodoItem {
  text: string;
  id: number;
  completed: boolean;
  onRemove: (id: number) => void;
  onToggle: (id: number) => void;
}
