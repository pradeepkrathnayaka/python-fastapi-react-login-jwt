import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { Loading } from '../components/common/Loading';
import { ROUTES } from '../utils/constants';

export function PrivateRoute() {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) return <Loading message="Checking session..." />;
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;

  return <Outlet />;
}
