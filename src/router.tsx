import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import AppLayout from './AppLayout';

export const router = createBrowserRouter([
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
