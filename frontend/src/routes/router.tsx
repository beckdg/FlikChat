import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import {
  HomePage,
  QuestionsPage,
  QuestionPage,
  DiscussionPage,
  LoginPage,
  RegisterPage,
  VerifyEmailPage,
  ForgotPasswordPage,
  ResetPasswordPage,
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
    path: '/verify-email',
    element: (
      <MainLayout>
        <VerifyEmailPage />
      </MainLayout>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <MainLayout>
        <ForgotPasswordPage />
      </MainLayout>
    ),
  },
  {
    path: '/reset-password',
    element: (
      <MainLayout>
        <ResetPasswordPage />
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
    path: '/discussions/:roomId',
    element: (
      <MainLayout>
        <DiscussionPage />
      </MainLayout>
    ),
  },
  {
    path: '/profile/:username',
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
