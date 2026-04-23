import { useAuthContext } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { formatDateTime } from '../../utils/formatters';

export function DashboardPage() {
  const { user } = useAuthContext();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          Welcome, {user?.username ?? 'User'}!
        </h1>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
          Here&apos;s your dashboard overview.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(14rem, 1fr))', gap: '1rem' }}>
        <Card title="Account">
          <p style={{ fontSize: '0.875rem', color: '#374151' }}>
            Email: <strong>{user?.email}</strong>
          </p>
          <p style={{ fontSize: '0.875rem', color: '#374151' }}>
            Role: <strong>{user?.is_superuser ? 'Admin' : 'User'}</strong>
          </p>
        </Card>

        <Card title="Last Updated">
          <p style={{ fontSize: '0.875rem', color: '#374151' }}>
            {user?.updated_at ? formatDateTime(user.updated_at) : '—'}
          </p>
        </Card>

        <Card title="Status">
          <p
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: user?.is_active ? '#16a34a' : '#ef4444',
            }}
          >
            {user?.is_active ? '● Active' : '● Inactive'}
          </p>
        </Card>
      </div>
    </div>
  );
}
