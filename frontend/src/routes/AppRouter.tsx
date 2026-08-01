import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';

import GuestGuard from '@/routes/guards/GuestGuard';
import AuthGuard from '@/routes/guards/AuthGuard';

import { Spinner } from '@/components/common/Loading';

import HomePage from '@/features/home/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import PaymentsPage from '@/pages/PaymentsPage';
import NotFoundPage from '@/pages/NotFoundPage';

const LandingPage = lazy(
  () => import('@/features/landing/pages/LandingPage'),
);

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

const BookingPage = lazy(
  () => import('@/features/bookings/pages/BookingPage'),
);

const MyBookingsPage = lazy(
  () => import('@/features/bookings/pages/MyBookingsPage'),
);

const ProviderDashboardPage = lazy(
  () => import('@/features/provider/pages/ProviderDashboardPage'),
);

const FavoritesPage = lazy(
  () => import('@/features/favorites/pages/FavoritesPage'),
);

const WeddingPlanPage = lazy(
  () => import('@/features/weddingPlan/pages/WeddingPlanPage'),
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
          {/* Marketing page at the root, outside MainLayout - it ships its
              own header and footer. The app itself lives under /home. */}
          <Route index element={<LandingPage />} />

          <Route element={<MainLayout />}>
            <Route
              path="home"
              element={<HomePage />}
            />

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
                path="my-bookings"
                element={<MyBookingsPage />}
              />

              <Route
                path="favorites"
                element={<FavoritesPage />}
              />

              <Route
                path="planner"
                element={<WeddingPlanPage />}
              />

              <Route
                path="provider/dashboard"
                element={<ProviderDashboardPage />}
              />
            </Route>

            {/* Inside MainLayout so a wrong URL still has a header, a footer,
                and a way back - not a bare page with no navigation. */}
            <Route
              path="404"
              element={<NotFoundPage />}
            />
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
            path="*"
            element={<Navigate to="/404" replace />}
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}