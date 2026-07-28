import { Link } from 'react-router-dom';
import { useTodos } from '../store/todoStore';
import styles from './StatisticPage.module.css';

export default function StatisticsPage() {
  const { todos } = useTodos();

  const totalCount = todos.length;
  const completedCount = todos.filter((todo) => todo.completed).length;
  const activeCount = todos.filter((todo) => !todo.completed).length;

  const lowCount = todos.filter((todo) => todo.priority === 'low').length;
  const mediumCount = todos.filter((todo) => todo.priority === 'medium').length;
  const highCount = todos.filter((todo) => todo.priority === 'high').length;
  return (
    <main className={styles.page}>
      <Link to="/" className={styles.backLink}>
        Назад к списку
      </Link>
      <h1 className={styles.title}>Моя статистика</h1>{' '}
      <p>Всего задач: {totalCount}</p>
      <p>Активных: {activeCount}</p>
      <p>Выполненных: {completedCount}</p>
      <h2>По приоритетам</h2>
      <p>Низкий: {lowCount}</p>
      <p>Средний: {mediumCount}</p>
      <p>Высокий: {highCount}</p>
    </main>
  );
}
