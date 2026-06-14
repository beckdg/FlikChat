import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryProvider } from '@/context/QueryProvider';
import { ThemeProvider } from '@/context/ThemeContext';
import { router } from '@/routes/router';
import { useAuthStore } from '@/store/authStore';
import { fetchMe } from '@/services/auth';

export const App = () => {
  const { accessToken, setAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    if (!accessToken) return;

    fetchMe()
      .then((res) => {
        if (res.success && res.data) {
          setAuth(res.data.user, accessToken);
        }
      })
      .catch(() => {
        clearAuth();
      });
  }, [accessToken, setAuth, clearAuth]);

  return (
    <ThemeProvider>
      <QueryProvider>
        <RouterProvider router={router} />
      </QueryProvider>
    </ThemeProvider>
  );
};
