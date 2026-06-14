import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryProvider } from '@/context/QueryProvider';
import { ThemeProvider } from '@/context/ThemeContext';
import { router } from '@/routes/router';
import { useAuthStore } from '@/store/authStore';
import { fetchMe } from '@/services/auth';
import { connectSocket, authenticated } from '@/services/socket';

export const App = () => {
  const { accessToken, setAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    connectSocket();
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetchMe()
        .then((res) => {
          if (res.success && res.data) {
            setAuth(res.data.user, accessToken);
            authenticated();
          }
        })
        .catch(() => {
          clearAuth();
        });
    }
  }, [accessToken, setAuth, clearAuth]);

  return (
    <ThemeProvider>
      <QueryProvider>
        <RouterProvider router={router} />
      </QueryProvider>
    </ThemeProvider>
  );
};
