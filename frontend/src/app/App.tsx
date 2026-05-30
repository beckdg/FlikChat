import { RouterProvider } from 'react-router-dom';
import { QueryProvider } from '@/context/QueryProvider';
import { router } from '@/routes/router';

export const App = () => {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  );
};
