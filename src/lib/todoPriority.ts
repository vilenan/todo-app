import type { TodoPriority } from '../types/ITodo';

export function getPriorityLabel(priority: TodoPriority) {
  switch (priority) {
    case 'low':
      return 'Низкий';
    case 'medium':
      return 'Средний';
    case 'high':
      return 'Высокий';
    default:
      return 'Средний';
  }
}

export function getPriorityClass(priority: TodoPriority) {
  switch (priority) {
    case 'low':
      return 'priorityLow';
    case 'medium':
      return 'priorityMedium';
    case 'high':
      return 'priorityHigh';
    default:
      return 'priorityMedium';
  }
}
