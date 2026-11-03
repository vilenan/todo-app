import { Link } from 'react-router-dom';
import styles from './ProfilePage.module.css';
import { useAuthStore } from '../store/authStore';
import Button from '../components/button/button';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();

  return (
    <main className={styles.page}>
      <Link className={styles.backLink} to="/">
        Вернуться к задачам
      </Link>

      <h1 className={styles.title}>Профиль</h1>

      <p className={styles.info}>
        <span>Email:</span> {user?.email}
      </p>

      <p className={styles.info}>
        <span>Статус:</span>{' '}
        {user?.emailVerified ? 'Email подтверждён' : 'Email не подтверждён'}
      </p>

      <div className={styles.actions}>
        <Link className={styles.statsLink} to="/stats">
          Перейти к статистике
        </Link>
        <Button type="button" onClick={logout}>
          Выйти
        </Button>
      </div>
    </main>
  );
}
