import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import AppLayout from './AppLayout';
import TodoDetailsPage from './pages/TodoDetailsPage';

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
        element: <TodoDetailsPage />,
      },
    ],
  },
]);
