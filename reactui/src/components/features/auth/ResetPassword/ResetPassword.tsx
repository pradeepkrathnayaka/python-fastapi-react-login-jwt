import { useActionState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Input } from '../../../common/Input';
import { Button } from '../../../common/Button';
import { authService } from '../../../../services/authService';
import { isValidEmail } from '../../../../utils/validators';
import { ROUTES } from '../../../../utils/constants';

interface ResetState {
  error: string | null;
  success: boolean;
}

export function ResetPassword() {
  const [state, submitAction, isPending] = useActionState<ResetState, FormData>(
    async (_prev, formData) => {
      const email = formData.get('email') as string;

      if (!isValidEmail(email)) {
        return { error: 'Please enter a valid email address', success: false };
      }

      try {
        await authService.requestPasswordReset({ email });
        return { error: null, success: true };
      } catch (err) {
        if (axios.isAxiosError(err)) {
          return { error: err.response?.data?.detail ?? 'Request failed', success: false };
        }
        return { error: 'An unexpected error occurred', success: false };
      }
    },
    { error: null, success: false }
  );

  return (
    <div style={{ width: '100%', maxWidth: '24rem', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Reset password</h1>
      <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        Enter your email and we&apos;ll send you a reset link
      </p>

      {state.error && (
        <div role="alert" style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '1rem', padding: '0.75rem', background: '#fef2f2', borderRadius: '0.375rem', border: '1px solid #fecaca' }}>
          {state.error}
        </div>
      )}

      {state.success ? (
        <div role="status" style={{ color: '#16a34a', fontSize: '0.875rem', padding: '0.75rem', background: '#f0fdf4', borderRadius: '0.375rem', border: '1px solid #bbf7d0' }}>
          Check your inbox for the reset link.
        </div>
      ) : (
        <form action={submitAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} noValidate>
          <Input name="email" label="Email" type="email" autoComplete="email" required disabled={isPending} />
          <Button type="submit" fullWidth isLoading={isPending}>
            Send reset link
          </Button>
        </form>
      )}

      <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
        <Link to={ROUTES.LOGIN}>Back to login</Link>
      </p>
    </div>
  );
}
