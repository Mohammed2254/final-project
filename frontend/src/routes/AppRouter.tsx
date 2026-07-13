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

const HallsListPage = lazy(() => import('@/features/halls/pages/HallsListPage'));
const HallDetailsPage = lazy(() => import('@/features/halls/pages/HallDetailsPage'));

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
            <Route path="photographers" element={<PhotographersPage />} />
            <Route path="planner" element={<WeddingPlannerPage />} />
            <Route path="favorites" element={<FavoritesPage />} />
            <Route path="booking" element={<BookingPage />} />
            <Route path="payments" element={<PaymentsPage />} />

            {/*
              Login-required (not yet role-gated to Provider specifically -
              account.role is available via useAuth() for that, but there's
              no real dashboard content yet to justify the extra branching).
            */}
            <Route element={<AuthGuard />}>
              <Route path="provider/dashboard" element={<ProviderDashboardPage />} />
            </Route>
          </Route>

          {/*
            Forgot/reset password are intentionally not routed: the backend
            has no matching endpoints yet (only /auth/login and
            /auth/register/*). The forms and hooks are still in
            features/auth for when that lands - just not reachable, so the
            app never dead-ends into a flow that can't succeed.
          */}
          <Route element={<GuestGuard />}>
            <Route element={<AuthLayout />}>
              <Route path="auth/login" element={<LoginPage />} />
              <Route path="auth/register" element={<RegisterPage />} />
            </Route>
          </Route>

          {/*
            Further protected routes (customer dashboard, profile, ...)
            can reuse the same <AuthGuard /> pattern as provider/dashboard
            above once those pages exist.
          */}

          <Route path="404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}