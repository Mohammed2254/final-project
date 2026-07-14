import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import GuestGuard from '@/routes/guards/GuestGuard';
import AuthGuard from '@/routes/guards/AuthGuard';
import { Spinner } from '@/components/common/Loading';

import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import PhotographersPage from '@/pages/PhotographersPage';
import WeddingPlannerPage from '@/pages/WeddingPlannerPage';
import FavoritesPage from '@/pages/FavoritesPage';
import BookingPage from '@/pages/BookingPage';
import PaymentsPage from '@/pages/PaymentsPage';
import ProviderDashboardPage from '@/pages/ProviderDashboardPage';
import NotFoundPage from '@/pages/NotFoundPage';

const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'));
const ProviderRegisterPage = lazy(
  () => import('@/features/auth/pages/ProviderRegisterPage'),
);

const HallsListPage = lazy(
  () => import('@/features/halls/pages/HallsListPage'),
);

const HallDetailsPage = lazy(
  () => import('@/features/halls/pages/HallDetailsPage'),
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

            <Route path="about" element={<AboutPage />} />

            <Route path="halls" element={<HallsListPage />} />
            <Route path="halls/:id" element={<HallDetailsPage />} />

            <Route
              path="photographers"
              element={<PhotographersPage />}
            />

            <Route
              path="planner"
              element={<WeddingPlannerPage />}
            />

            <Route
              path="favorites"
              element={<FavoritesPage />}
            />

            <Route
              path="booking"
              element={<BookingPage />}
            />

            <Route
              path="payments"
              element={<PaymentsPage />}
            />

            {/*
              هذه الصفحة تتطلب تسجيل الدخول.

              لاحقًا يمكن إضافة ProviderGuard للتحقق من أن:
              account.role === 'Provider'
            */}
            <Route element={<AuthGuard />}>
              <Route
                path="provider/dashboard"
                element={<ProviderDashboardPage />}
              />
            </Route>
          </Route>

          {/*
            صفحات المصادقة متاحة فقط للزوار غير المسجلين.

            GuestGuard يمنع المستخدم المسجل من الرجوع إلى:
            - تسجيل الدخول
            - تسجيل العميل
            - تسجيل مقدم الخدمة
          */}
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

          {/*
            Forgot/reset password غير مضافة حاليًا؛
            لأن الباك إند لا يحتوي على نقاط النهاية الخاصة بها.
          */}

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
