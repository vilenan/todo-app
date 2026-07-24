import { Link } from 'react-router-dom';
import { useTodos } from '../store/todoStore';
import styles from './StatisticPage.module.css';

export default function StatisticsPage() {
  const { todos } = useTodos();
  return (
    <main className={styles.page}>
      <Link to="/" className={styles.backLink}>
        Назад к списку
      </Link>
      <h1 className={styles.title}>Моя статистика</h1>{' '}
      <p>Всего задач: {todos.length}</p>
    </main>
  );
}
