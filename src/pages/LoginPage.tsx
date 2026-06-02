import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import styles from './AuthPage.module.css';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, login, logout, error, clearError } = useAuthStore();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await login(email, password);
  }

  return (
    <main className={styles.shell}>
      <section className={styles.card}>
        <h1 className={styles.title}>Вход</h1>

        {user ? (
          <div className={styles.actions}>
            <p className={styles.note}>Вы вошли как {user.email}</p>
            <button className={styles.button} type="button" onClick={logout}>
              Выйти
            </button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.label}>
              Email
              <input
                className={styles.input}
                type="email"
                value={email}
                onChange={(e) => {
                  clearError();
                  setEmail(e.target.value);
                }}
                placeholder="Введите email"
                required
              />
            </label>

            <label className={styles.label}>
              Пароль
              <input
                className={styles.input}
                type="password"
                value={password}
                onChange={(e) => {
                  clearError();
                  setPassword(e.target.value);
                }}
                placeholder="Введите пароль"
                required
              />
            </label>

            <div className={styles.actions}>
              <button className={styles.button} type="submit">
                Войти
              </button>

              {error && <p className={styles.note}>{error}</p>}

              <p className={styles.text}>
                Нет аккаунта?{' '}
                <Link className={styles.link} to="/signup">
                  Создать
                </Link>
              </p>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
