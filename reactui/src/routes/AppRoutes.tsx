import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { MainLayout } from '../components/layout/MainLayout';
import { LoginPage } from '../pages/Login';
import { RegisterPage } from '../pages/Register';
import { ResetPasswordPage } from '../pages/ResetPassword';
import { DashboardPage } from '../pages/Dashboard';
import { ProfilePage } from '../pages/Profile';
import { NotFoundPage } from '../pages/NotFound';
import { ROUTES } from '../utils/constants';

function ProtectedLayout() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes – no layout */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />

      {/* Protected routes – auth guard then layout */}
      <Route element={<PrivateRoute />}>
        <Route element={<ProtectedLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Redirects */}
      <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
