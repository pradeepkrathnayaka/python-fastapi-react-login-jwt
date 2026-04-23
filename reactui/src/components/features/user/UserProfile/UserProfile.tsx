import { useEffect, useState } from 'react';
import { userService } from '../../../../services/userService';
import { useAuthContext } from '../../../../context/AuthContext';
import { Card } from '../../../common/Card';
import { Loading } from '../../../common/Loading';
import { formatDate } from '../../../../utils/formatters';
import type { User } from '../../../../types';

export function UserProfile() {
  const { user: ctxUser, setUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState(!ctxUser);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ctxUser) {
      setIsLoading(true);
      userService
        .getProfile()
        .then((data: User) => {
          setUser(data);
        })
        .catch(() => setError('Failed to load profile'))
        .finally(() => setIsLoading(false));
    }
  }, [ctxUser, setUser]);

  if (isLoading) return <Loading message="Loading profile..." />;
  if (error) return <p style={{ color: '#ef4444' }}>{error}</p>;
  if (!ctxUser) return null;

  return (
    <Card title="Profile">
      <dl style={{ display: 'grid', gridTemplateColumns: '8rem 1fr', gap: '0.5rem 1rem', fontSize: '0.875rem' }}>
        <dt style={{ fontWeight: 600, color: '#374151' }}>Username</dt>
        <dd style={{ margin: 0 }}>{ctxUser.username}</dd>
        <dt style={{ fontWeight: 600, color: '#374151' }}>Email</dt>
        <dd style={{ margin: 0 }}>{ctxUser.email}</dd>
        {ctxUser.full_name && (
          <>
            <dt style={{ fontWeight: 600, color: '#374151' }}>Full name</dt>
            <dd style={{ margin: 0 }}>{ctxUser.full_name}</dd>
          </>
        )}
        <dt style={{ fontWeight: 600, color: '#374151' }}>Member since</dt>
        <dd style={{ margin: 0 }}>{formatDate(ctxUser.created_at)}</dd>
        <dt style={{ fontWeight: 600, color: '#374151' }}>Status</dt>
        <dd style={{ margin: 0, color: ctxUser.is_active ? '#16a34a' : '#ef4444' }}>
          {ctxUser.is_active ? 'Active' : 'Inactive'}
        </dd>
      </dl>
    </Card>
  );
}
