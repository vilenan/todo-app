import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import styles from './AuthPage.module.css';
import { pb } from '../lib/pocketbase';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [currentUserEmail, setCurrentUserEmail] = useState(
    pb.authStore.record?.email ?? ''
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      setSuccessMessage('');
      return;
    }

    try {
      await pb.collection('users').create({
        email,
        password,
        passwordConfirm: confirmPassword,
      });
      setError('');
      setSuccessMessage('Аккаунт создан. Теперь можно войти.');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (requestError) {
      console.error('PocketBase signup error:', requestError);
      setError('Не удалось создать аккаунт. Проверьте данные.');
      setSuccessMessage('');
    }
  }

  function handleLogout() {
    pb.authStore.clear();
    setCurrentUserEmail('');
  }

  return (
    <main className={styles.shell}>
      <section className={styles.card}>
        <h1 className={styles.title}>Регистрация</h1>

        {currentUserEmail ? (
          <div className={styles.actions}>
            <p className={styles.note}>
              Вы уже авторизованы как {currentUserEmail}
            </p>
            <button
              className={styles.button}
              type="button"
              onClick={handleLogout}
            >
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
                  setError('');
                  setSuccessMessage('');
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
                  setError('');
                  setSuccessMessage('');
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
                  setSuccessMessage('');
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
              {successMessage && (
                <p className={styles.note}>{successMessage}</p>
              )}

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
