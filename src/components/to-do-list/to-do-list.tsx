import styles from './to-do-list.module.css';
import { TodoItem } from '../to-do-item/to-do-item';
import type { ITodo } from '../../types/ITodo';

interface TodoListProps {
  todos: ITodo[];
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDetails: (id: string) => void;
}

function TodoList({
  todos,
  onRemove,
  onToggle,
  onEdit,
  onDetails,
}: TodoListProps) {
  return (
    <ul className={styles.list}>
      {todos.map((item: ITodo) => (
        <li key={item.id}>
          <TodoItem
            id={item.id}
            text={item.text}
            description={item.description}
            dueDate={item.dueDate}
            priority={item.priority}
            completed={item.completed}
            onRemove={onRemove}
            onToggle={onToggle}
            onEdit={onEdit}
            onDetails={onDetails}
          />
        </li>
      ))}
    </ul>
  );
}

export default TodoList;
