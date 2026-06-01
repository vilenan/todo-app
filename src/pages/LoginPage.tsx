import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import styles from './AuthPage.module.css';
import { pb } from '../lib/pocketbase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authStatus, setAuthStatus] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await pb.collection('users').authWithPassword(email, password);
      console.log('pb.authStore.isValid:', pb.authStore.isValid);
      console.log('pb.authStore.token:', pb.authStore.token);
      console.log('pb.authStore.record:', pb.authStore.record);
      setAuthStatus('Вход выполнен успешно.');
    } catch (error) {
      console.error('PocketBase auth error:', error);
      setAuthStatus('Не удалось войти. Проверьте email и пароль.');
    }
  }

  return (
    <main className={styles.shell}>
      <section className={styles.card}>
        <h1 className={styles.title}>Вход</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>
            Email
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => {
                setAuthStatus('');
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
                setAuthStatus('');
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

            {authStatus && <p className={styles.note}>{authStatus}</p>}

            <p className={styles.text}>
              Нет аккаунта?{' '}
              <Link className={styles.link} to="/signup">
                Создать
              </Link>
            </p>
          </div>
        </form>
      </section>
    </main>
  );
}
