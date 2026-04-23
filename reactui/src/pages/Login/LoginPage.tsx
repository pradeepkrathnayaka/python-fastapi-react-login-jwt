import { Navigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { LoginForm } from '../../components/features/auth/LoginForm';
import { useAuthContext } from '../../context/AuthContext';
import { ROUTES } from '../../utils/constants';

export function LoginPage() {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        background: 'var(--color-gray-50, #f9fafb)',
      }}
    >
      <Card style={{ width: '100%', maxWidth: '26rem' }}>
        <LoginForm />
      </Card>
    </div>
  );
}

