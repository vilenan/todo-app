import { TodoCategory, TodoPriority } from '@prisma/client';

export class UpdateTodoDto {
  text?: string;
  description?: string;
  dueDate?: string | null;
  completed?: boolean;
  priority?: TodoPriority;
  category?: TodoCategory | null;
}
