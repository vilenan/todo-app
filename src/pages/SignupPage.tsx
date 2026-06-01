import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import styles from './AuthPage.module.css';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    setError('');
    window.alert(`Пароль подтвержден, но это ничего не значит`);
  }

  return (
    <main className={styles.shell}>
      <section className={styles.card}>
        <h1 className={styles.title}>Регистрация</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>
            Email
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                setError('');
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
                setError('');
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
      </section>
    </main>
  );
}
