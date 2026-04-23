import { useActionState } from 'react';
import axios from 'axios';
import { Input } from '../../../common/Input';
import { Button } from '../../../common/Button';
import { Card } from '../../../common/Card';
import { userService } from '../../../../services/userService';
import { useAuthContext } from '../../../../context/AuthContext';
import { isValidPassword, passwordsMatch } from '../../../../utils/validators';

interface SettingsState {
  error: string | null;
  success: string | null;
}

export function UserSettings() {
  const { user, setUser } = useAuthContext();

  const [profileState, profileAction, isProfilePending] = useActionState<SettingsState, FormData>(
    async (_prev, formData) => {
      const full_name = formData.get('full_name') as string;
      try {
        const updated = await userService.updateProfile({ full_name: full_name || undefined });
        setUser(updated);
        return { error: null, success: 'Profile updated successfully' };
      } catch (err) {
        if (axios.isAxiosError(err)) {
          return { error: err.response?.data?.detail ?? 'Update failed', success: null };
        }
        return { error: 'An unexpected error occurred', success: null };
      }
    },
    { error: null, success: null }
  );

  const [passwordState, passwordAction, isPasswordPending] = useActionState<SettingsState, FormData>(
    async (_prev, formData) => {
      const current_password = formData.get('current_password') as string;
      const new_password = formData.get('new_password') as string;
      const confirm_password = formData.get('confirm_password') as string;

      if (!isValidPassword(new_password)) {
        return { error: 'New password must be at least 8 characters', success: null };
      }
      if (!passwordsMatch(new_password, confirm_password)) {
        return { error: 'Passwords do not match', success: null };
      }

      try {
        await userService.updatePassword({ current_password, new_password, confirm_password });
        return { error: null, success: 'Password changed successfully' };
      } catch (err) {
        if (axios.isAxiosError(err)) {
          return { error: err.response?.data?.detail ?? 'Password change failed', success: null };
        }
        return { error: 'An unexpected error occurred', success: null };
      }
    },
    { error: null, success: null }
  );

  const alertStyle = (type: 'error' | 'success') => ({
    padding: '0.75rem',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    marginBottom: '1rem',
    ...(type === 'error'
      ? { color: '#ef4444', background: '#fef2f2', border: '1px solid #fecaca' }
      : { color: '#16a34a', background: '#f0fdf4', border: '1px solid #bbf7d0' }),
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Card title="Profile Settings">
        {profileState.error && <div role="alert" style={alertStyle('error')}>{profileState.error}</div>}
        {profileState.success && <div role="status" style={alertStyle('success')}>{profileState.success}</div>}
        <form action={profileAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input name="full_name" label="Full Name" type="text" defaultValue={user?.full_name ?? ''} disabled={isProfilePending} />
          <Button type="submit" isLoading={isProfilePending} style={{ alignSelf: 'flex-start' }}>
            Save changes
          </Button>
        </form>
      </Card>

      <Card title="Change Password">
        {passwordState.error && <div role="alert" style={alertStyle('error')}>{passwordState.error}</div>}
        {passwordState.success && <div role="status" style={alertStyle('success')}>{passwordState.success}</div>}
        <form action={passwordAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input name="current_password" label="Current Password" type="password" autoComplete="current-password" required disabled={isPasswordPending} />
          <Input name="new_password" label="New Password" type="password" autoComplete="new-password" helperText="Min 8 characters" required disabled={isPasswordPending} />
          <Input name="confirm_password" label="Confirm New Password" type="password" autoComplete="new-password" required disabled={isPasswordPending} />
          <Button type="submit" isLoading={isPasswordPending} style={{ alignSelf: 'flex-start' }}>
            Change password
          </Button>
        </form>
      </Card>
    </div>
  );
}
