import styles from './to-do-list.module.css';
import { TodoItem } from '../to-do-item/to-do-item';
import type { ITodo } from '../../types/ITodo';

interface TodoListProps {
  todos: ITodo[];
  onRemove: (id: number) => void;
  onToggle: (id: number) => void;
  onEdit: (id: number) => void;
}

function TodoList({ todos, onRemove, onToggle, onEdit }: TodoListProps) {
  return (
    <ul className={styles.list}>
      {todos.map((item: ITodo) => (
        <li key={item.id}>
          <TodoItem
            id={item.id}
            text={item.text}
            description={item.description}
            dueDate={item.dueDate}
            completed={item.completed}
            onRemove={onRemove}
            onToggle={onToggle}
            onEdit={onEdit}
          />
        </li>
      ))}
    </ul>
  );
}

export default TodoList;
