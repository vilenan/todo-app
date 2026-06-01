import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import AppLayout from './AppLayout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: 'todo/:id',
        lazy: () => import('./pages/TodoDetailsPage'),
      },
    ],
  },
]);
