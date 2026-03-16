import type { ITodo } from '../../types/ITodo';

export type TodosState = {
  todos: ITodo[];
};

export type AddTodoPayload = {
  text: string;
  description?: string;
  dueDate?: string;
};

export type UpdateTodoPayload = {
  id: number;
  text: string;
  description?: string;
  dueDate?: string;
};

export type TodosAction =
  | { type: 'ADD_TODO'; payload: AddTodoPayload }
  | { type: 'UPDATE_TODO'; payload: UpdateTodoPayload }
  | { type: 'REMOVE_TODO'; payload: { id: number } }
  | { type: 'TOGGLE_TODO'; payload: { id: number } }
  | { type: 'CLEAR_ALL' }
  | { type: 'CLEAR_COMPLETED' };

export const initialTodosState: TodosState = {
  todos: [],
};

export function todosReducer(
  state: TodosState,
  action: TodosAction
): TodosState {
  switch (action.type) {
    case 'ADD_TODO': {
      const { text, description, dueDate } = action.payload;
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: Date.now(),
            text,
            description,
            dueDate,
            completed: false,
          },
        ],
      };
    }

    case 'UPDATE_TODO': {
      const { id, text, description, dueDate } = action.payload;
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === id ? { ...todo, text, description, dueDate } : todo
        ),
      };
    }

    case 'REMOVE_TODO': {
      const { id } = action.payload;
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== id),
      };
    }

    case 'TOGGLE_TODO': {
      const { id } = action.payload;
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ),
      };
    }

    case 'CLEAR_ALL':
      return {
        ...state,
        todos: [],
      };

    case 'CLEAR_COMPLETED':
      return {
        ...state,
        todos: state.todos.filter((todo) => !todo.completed),
      };

    default:
      return state;
  }
}
