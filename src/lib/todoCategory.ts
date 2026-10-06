import type { TodoCategory } from '../types/ITodo';

export function getCategoryClass(category: TodoCategory) {
  switch (category) {
    case 'home':
      return 'categoryHome';
    case 'study':
      return 'categoryStudy';
    case 'work':
      return 'categoryWork';
  }
}
