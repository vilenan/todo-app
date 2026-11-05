import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';
import styles from './AppLayout.module.css';

export default function AppLayout() {
  const { user, token, initAuth, isLoading } = useAuthStore();

  useEffect(() => {
    if (token) return;

    initAuth();
  }, [initAuth, token]);
  if (isLoading) {
    return (
      <div className={styles.loading} role="status">
        <img
          className={styles.emblem}
          src={`${import.meta.env.BASE_URL}app-emblem.png`}
          alt=""
        />
        <p>Проверяем вход...</p>
      </div>
    );
  }

  if (!user && !isLoading) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
