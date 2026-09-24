import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import styles from './AuthPage.module.css';
import { useAuthStore } from '../store/authStore';

const verificationRequests = new Map<string, Promise<void>>();

function verifyEmailOnce(
  token: string,
  verifyEmail: (token: string) => Promise<void>
) {
  const existingRequest = verificationRequests.get(token);
  if (existingRequest) return existingRequest;

  const request = verifyEmail(token);
  verificationRequests.set(token, request);
  return request;
}

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const verifyEmail = useAuthStore((state) => state.verifyEmail);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(() =>
    searchParams.get('token') ? 'loading' : 'error'
  );
  const hasStarted = useRef(false);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) return;

    if (hasStarted.current) return;
    hasStarted.current = true;

    void verifyEmailOnce(token, verifyEmail)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [searchParams, verifyEmail]);

  return (
    <main className={styles.shell}>
      <section className={styles.card}>
        {status === 'loading' && (
          <p className={styles.note}>Подтверждаем email…</p>
        )}
        {status === 'success' && (
          <>
            <h1 className={styles.title}>Email подтверждён</h1>
            <p className={styles.note}>
              Теперь адрес электронной почты подтверждён.
            </p>
            <Link className={styles.link} to="/">
              Перейти к задачам
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <h1 className={styles.title}>Не удалось подтвердить email</h1>
            <p className={styles.note}>
              Ссылка недействительна, уже использована или истекла.
            </p>
            <Link className={styles.link} to="/">
              Вернуться в приложение
            </Link>
          </>
        )}
      </section>
    </main>
  );
}
