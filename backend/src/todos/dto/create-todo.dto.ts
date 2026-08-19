import { TodoPriority } from '@prisma/client';

export class CreateTodoDto {
  text!: string;
  description?: string;
  dueDate?: string;
  priority?: TodoPriority;
}
