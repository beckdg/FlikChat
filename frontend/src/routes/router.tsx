import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import {
  HomePage,
  QuestionsPage,
  QuestionPage,
  LoginPage,
  RegisterPage,
  ProfilePage,
  NotFoundPage,
} from '@/pages';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <MainLayout>
        <HomePage />
      </MainLayout>
    ),
  },
  {
    path: '/questions',
    element: (
      <MainLayout>
        <QuestionsPage />
      </MainLayout>
    ),
  },
  {
    path: '/questions/:id',
    element: (
      <MainLayout>
        <QuestionPage />
      </MainLayout>
    ),
  },
  {
    path: '/login',
    element: (
      <MainLayout>
        <LoginPage />
      </MainLayout>
    ),
  },
  {
    path: '/register',
    element: (
      <MainLayout>
        <RegisterPage />
      </MainLayout>
    ),
  },
  {
    path: '/profile',
    element: (
      <MainLayout>
        <ProfilePage />
      </MainLayout>
    ),
  },
  {
    path: '*',
    element: (
      <MainLayout>
        <NotFoundPage />
      </MainLayout>
    ),
  },
]);
