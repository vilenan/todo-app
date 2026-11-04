import type { TodoCategory, TodoPriority } from '../types/ITodo';

export type TodoDraft = {
  text: string;
  description: string;
  dueDate: string;
  priority: TodoPriority;
  category: TodoCategory | null;
};

export function hasDraftChanged(original: TodoDraft, current: TodoDraft) {
  return (Object.keys(original) as (keyof TodoDraft)[]).some(
    (key) => original[key] !== current[key]
  );
}

export function confirmDiscard(isDirty: boolean) {
  return (
    !isDirty ||
    window.confirm('Есть несохранённые изменения. Выйти без сохранения?')
  );
}
