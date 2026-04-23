import { UserProfile } from '../../components/features/user/UserProfile';
import { UserSettings } from '../../components/features/user/UserSettings';

export function ProfilePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '42rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 0 }}>My Profile</h1>
      <UserProfile />
      <UserSettings />
    </div>
  );
}
