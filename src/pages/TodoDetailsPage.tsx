import { Link, useParams } from 'react-router-dom';
import appStyles from '../App.module.css';
import styles from './TodoDetailsPage.module.css';
import type { ITodo } from '../types/ITodo';

type Props = {
  todos: ITodo[];
};

export default function TodoDetailsPage({ todos }: Props) {
  const { id } = useParams();
  const todo = todos.find((t) => t.id === Number(id));

  if (!todo) {
    return (
      <div className={appStyles.container}>
        <p>Задача не найдена</p>
        <Link className={styles.backLink} to="/">
          Назад к списку
        </Link>
      </div>
    );
  }

  return (
    <div className={appStyles.container}>
      <h1 className={appStyles.title}>Задача</h1>

      <div className={styles.detailsCard}>
        <div className={styles.header}>
          <p className={styles.cardTitle}>Карточка задачи</p>
          <span
            className={`${styles.statusBadge} ${todo.completed ? styles.statusDone : styles.statusActive}`}
          >
            {todo.completed ? 'Выполнена' : 'Активна'}
          </span>
        </div>

        <div className={styles.row}>
          <h2 className={styles.label}>Текст задачи</h2>
          <p className={styles.value}>{todo.text}</p>
        </div>

        <div className={styles.row}>
          <h2 className={styles.label}>Описание задачи</h2>
          <p className={styles.value}>{todo.description || 'Нет описания'}</p>
        </div>

        <div className={styles.row}>
          <h2 className={styles.label}>Срок выполнения</h2>
          <p className={styles.value}>{todo.dueDate || 'Не указан'}</p>
        </div>
      </div>

      <Link className={styles.backLink} to="/">
        Назад к списку
      </Link>
    </div>
  );
}
