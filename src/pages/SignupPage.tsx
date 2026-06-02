import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import styles from './AuthPage.module.css';
import { useAuthStore } from '../store/authStore';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { user, signUp, error, clearError, logout } = useAuthStore();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await signUp(email, password, confirmPassword);
  }

  return (
    <main className={styles.shell}>
      <section className={styles.card}>
        <h1 className={styles.title}>Регистрация</h1>

        {user ? (
          <div className={styles.actions}>
            <p className={styles.note}>Вы уже авторизованы как {user.email}</p>
            <button className={styles.button} type="button" onClick={logout}>
              Выйти
            </button>
            <p className={styles.text}>
              Если нужен другой аккаунт, сначала выйдите, а потом
              зарегистрируйтесь.
            </p>
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
                placeholder="Минимум 8 символов"
                minLength={8}
                required
              />
            </label>

            <label className={styles.label}>
              Повторите пароль
              <input
                className={styles.input}
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  clearError();
                  setConfirmPassword(e.target.value);
                }}
                placeholder="Повторите пароль"
                minLength={8}
                required
              />
            </label>

            <div className={styles.actions}>
              <button className={styles.button} type="submit">
                Создать аккаунт
              </button>

              {error && <p className={styles.note}>{error}</p>}
              <p className={styles.text}>
                Уже есть аккаунт?{' '}
                <Link className={styles.link} to="/login">
                  Войти
                </Link>
              </p>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
