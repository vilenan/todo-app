import styles from './to-do-item.module.css';
import Button from '../button/button';

import type { ITodoItem } from '../../types/ITodoItem';

export function TodoItem({
  text,
  description,
  dueDate,
  id,
  completed,
  onRemove,
  onToggle,
  onEdit,
}: ITodoItem) {
  return (
    <div className={styles.item}>
      <input
        type="checkbox"
        checked={completed}
        onChange={() => {
          console.log('переключаем', id, onToggle);
          onToggle(id);
        }}
      />
      <div className={styles.content}>
        <span className={`${styles.text} ${completed ? styles.done : ''}`}>
          {text}
        </span>
        {description && <p className={styles.description}>{description}</p>}
        {dueDate && <p className={styles.due}>Срок: {dueDate}</p>}
      </div>
      <Button
        onClick={() => {
          onEdit(id);
        }}
      >
        Редактировать
      </Button>
      <Button
        onClick={() => {
          console.log('Удаляем', id);
          onRemove(id);
        }}
        ariaLabel="Удалить задачу"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
      </Button>
    </div>
  );
}
