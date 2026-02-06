import styles from './to-do-list.module.css';
import TodoItem from '../to-do-item/to-do-item';
import type { ITodo } from '../../types/ITodo';

interface TodoListProps {
  todos: ITodo[];
  onRemove: (id: number) => void;
  onToggle: (id: number) => void;
}

function TodoList({ todos, onRemove, onToggle }: TodoListProps) {
  return (
    <ul className={styles.list}>
      {todos.map((item: ITodo) => (
        <li key={item.id}>
          <TodoItem
            id={item.id}
            text={item.text}
            completed={item.completed}
            onRemove={onRemove}
            onToggle={onToggle}
          />
        </li>
      ))}
    </ul>
  );
}

export default TodoList;
