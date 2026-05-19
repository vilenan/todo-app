import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import TodoDetailsPage from './pages/TodoDetailsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/todo/:id',
    element: <TodoDetailsPage />,
  },
]);
