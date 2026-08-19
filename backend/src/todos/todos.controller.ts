import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  CurrentUser,
  type CurrentUserType,
} from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodosService } from './todos.service';
import { UpdateTodoDto } from './dto/update-todo.dto';

type TodoFilter = 'all' | 'active' | 'completed';

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  findAll(
    @CurrentUser() user: CurrentUserType,
    @Query('filter') filter: TodoFilter = 'all',
  ) {
    return this.todosService.findAll(user.id, filter);
  }

  @Get('stats')
  getStats(@CurrentUser() user: CurrentUserType) {
    return this.todosService.getStats(user.id);
  }

  @Post()
  create(@CurrentUser() user: CurrentUserType, @Body() dto: CreateTodoDto) {
    return this.todosService.create(user.id, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: CurrentUserType,
    @Param('id') id: string,
    @Body() dto: UpdateTodoDto,
  ) {
    return this.todosService.update(user.id, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: CurrentUserType, @Param('id') id: string) {
    return this.todosService.remove(user.id, id);
  }
}
