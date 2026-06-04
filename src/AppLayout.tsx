import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';

export default function AppLayout() {
  const { user, initAuth, isLoading } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);
  if (isLoading) return <p>Идет проверка</p>;

  if (!user && !isLoading) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
