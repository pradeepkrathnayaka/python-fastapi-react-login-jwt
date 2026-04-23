import { Card } from '../../components/common/Card';
import { RegisterForm } from '../../components/features/auth/RegisterForm';

export function RegisterPage() {
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
        <RegisterForm />
      </Card>
    </div>
  );
}
