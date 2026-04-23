import { Card } from '../../components/common/Card';
import { ResetPassword } from '../../components/features/auth/ResetPassword';

export function ResetPasswordPage() {
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
        <ResetPassword />
      </Card>
    </div>
  );
}
