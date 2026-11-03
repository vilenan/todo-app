import styles from './to-do-item.module.css';
import Button from '../button/button';
import { formatDate } from '../../lib/formatDate';

import type { ITodoItem } from '../../types/ITodoItem';
import { getPriorityLabel, getPriorityClass } from '../../lib/todoPriority';
import { getCategoryClass } from '../../lib/todoCategory';

export function TodoItem({
  text,
  description,
  dueDate,
  id,
  completed,
  priority,
  category,
  onRemove,
  onToggle,
  onEdit,
  onDetails,
}: ITodoItem) {
  return (
    <div className={styles.item}>
      <label className={styles.checkbox}>
        <input
          type="checkbox"
          checked={completed}
          onChange={() => {
            console.log('переключаем', id, onToggle);
            onToggle(id);
          }}
        />
        <span className={styles.checkboxBox} aria-hidden="true" />
      </label>
      <div className={styles.content}>
        <span className={`${styles.text} ${completed ? styles.done : ''}`}>
          {text}
        </span>
        {description && <p className={styles.description}>{description}</p>}
        <div className={styles.metaRow}>
          {dueDate && <p className={styles.due}>Срок: {formatDate(dueDate)}</p>}
          <span
            className={`${styles.priorityBadge} ${styles[getPriorityClass(priority)]}`}
          >
            Приоритет {getPriorityLabel(priority)}
          </span>
          {category && (
            <span className={`${styles[getCategoryClass(category)]}`}>
              #{category}
            </span>
          )}
        </div>
      </div>
      <Button
        className={styles.actionButton}
        onClick={() => {
          onDetails(id);
        }}
        ariaLabel="Открыть подробности задачи"
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
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </Button>
      <Button
        className={styles.actionButton}
        onClick={() => {
          onEdit(id);
        }}
        ariaLabel="Редактировать задачу"
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
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      </Button>
      <Button
        className={styles.actionButton}
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
