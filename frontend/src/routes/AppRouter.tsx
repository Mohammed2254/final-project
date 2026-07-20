import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';

import GuestGuard from '@/routes/guards/GuestGuard';
import AuthGuard from '@/routes/guards/AuthGuard';

import { Spinner } from '@/components/common/Loading';

import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import WeddingPlannerPage from '@/pages/WeddingPlannerPage';
import BookingPage from '@/pages/BookingPage';
import PaymentsPage from '@/pages/PaymentsPage';
import ProviderDashboardPage from '@/pages/ProviderDashboardPage';
import NotFoundPage from '@/pages/NotFoundPage';

const LoginPage = lazy(
  () => import('@/features/auth/pages/LoginPage'),
);

const RegisterPage = lazy(
  () => import('@/features/auth/pages/RegisterPage'),
);

const ProviderRegisterPage = lazy(
  () => import('@/features/auth/pages/ProviderRegisterPage'),
);

const HallsListPage = lazy(
  () => import('@/features/halls/pages/HallsListPage'),
);

const HallDetailsPage = lazy(
  () => import('@/features/halls/pages/HallDetailsPage'),
);

const PhotographersListPage = lazy(
  () => import('@/features/photographers/pages/PhotographersListPage'),
);

const PhotographerDetailsPage = lazy(
  () => import('@/features/photographers/pages/PhotographerDetailsPage'),
);

const FavoritesPage = lazy(
  () => import('@/features/favorites/pages/FavoritesPage'),
);

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

            <Route
              path="about"
              element={<AboutPage />}
            />

            <Route
              path="halls"
              element={<HallsListPage />}
            />

            <Route
              path="halls/:id"
              element={<HallDetailsPage />}
            />

            <Route
              path="photographers"
              element={<PhotographersListPage />}
            />

            <Route
              path="photographers/:id"
              element={<PhotographerDetailsPage />}
            />

            <Route
              path="planner"
              element={<WeddingPlannerPage />}
            />

            <Route
              path="payments"
              element={<PaymentsPage />}
            />

            {/* الصفحات التي تحتاج تسجيل دخول */}
            <Route element={<AuthGuard />}>
              <Route
                path="booking/:serviceId"
                element={<BookingPage />}
              />

              <Route
                path="favorites"
                element={<FavoritesPage />}
              />

              <Route
                path="provider/dashboard"
                element={<ProviderDashboardPage />}
              />
            </Route>
          </Route>

          {/* صفحات الزوار فقط */}
          <Route element={<GuestGuard />}>
            <Route element={<AuthLayout />}>
              <Route
                path="auth/login"
                element={<LoginPage />}
              />

              <Route
                path="auth/register"
                element={<RegisterPage />}
              />

              <Route
                path="auth/register/provider"
                element={<ProviderRegisterPage />}
              />
            </Route>
          </Route>

          <Route
            path="404"
            element={<NotFoundPage />}
          />

          <Route
            path="*"
            element={<Navigate to="/404" replace />}
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}