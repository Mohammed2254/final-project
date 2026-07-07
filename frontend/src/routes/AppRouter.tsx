import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import GuestGuard from '@/routes/guards/GuestGuard';
import { Spinner } from '@/components/common/Loading';

import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import HallsPage from '@/pages/HallsPage';
import NotFoundPage from '@/pages/NotFoundPage';

const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'));

function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Spinner size={28} />
    </div>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="halls" element={<HallsPage />} />
          </Route>

          {
            
          }
          <Route element={<GuestGuard />}>
            <Route element={<AuthLayout />}>
              <Route path="auth/login" element={<LoginPage />} />
              <Route path="auth/register" element={<RegisterPage />} />
            </Route>
          </Route>

          {

          }

          <Route path="404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}