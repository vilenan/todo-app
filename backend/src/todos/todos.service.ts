import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

type TodoFilter = 'all' | 'active' | 'completed';

@Injectable()
export class TodosService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, filter: TodoFilter = 'all') {
    return this.prisma.todo.findMany({
      where: {
        userId,
        ...(filter === 'active' ? { completed: false } : {}),
        ...(filter === 'completed' ? { completed: true } : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(userId: string, dto: CreateTodoDto) {
    return this.prisma.todo.create({
      data: {
        userId,
        text: dto.text,
        description: dto.description,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        priority: dto.priority ?? 'medium',
      },
    });
  }

  async update(userId: string, todoId: string, dto: UpdateTodoDto) {
    await this.ensureTodoBelongsToUser(userId, todoId);

    return this.prisma.todo.update({
      where: { id: todoId },
      data: {
        text: dto.text,
        description: dto.description,
        completed: dto.completed,
        dueDate:
          dto.dueDate === undefined
            ? undefined
            : dto.dueDate === null || dto.dueDate === ''
              ? null
              : new Date(dto.dueDate),
        priority: dto.priority,
      },
    });
  }

  async remove(userId: string, todoId: string) {
    await this.ensureTodoBelongsToUser(userId, todoId);

    await this.prisma.todo.delete({
      where: { id: todoId },
    });

    return { success: true };
  }

  async getStats(userId: string) {
    const [total, completed, active, low, medium, high] = await Promise.all([
      this.prisma.todo.count({ where: { userId } }),
      this.prisma.todo.count({ where: { userId, completed: true } }),
      this.prisma.todo.count({ where: { userId, completed: false } }),
      this.prisma.todo.count({ where: { userId, priority: 'low' } }),
      this.prisma.todo.count({ where: { userId, priority: 'medium' } }),
      this.prisma.todo.count({ where: { userId, priority: 'high' } }),
    ]);

    return {
      total,
      completed,
      active,
      byPriority: {
        low,
        medium,
        high,
      },
    };
  }

  private async ensureTodoBelongsToUser(userId: string, todoId: string) {
    const todo = await this.prisma.todo.findUnique({
      where: { id: todoId },
    });

    if (!todo) {
      throw new NotFoundException('Задача не найдена');
    }

    if (todo.userId !== userId) {
      throw new ForbiddenException('Нет доступа к этой задаче');
    }

    return todo;
  }
}
