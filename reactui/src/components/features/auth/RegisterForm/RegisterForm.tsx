import { useActionState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Input } from '../../../common/Input';
import { Button } from '../../../common/Button';
import { authService } from '../../../../services/authService';
import { ROUTES } from '../../../../utils/constants';
import { isValidEmail, isValidUsername, isValidPassword, passwordsMatch } from '../../../../utils/validators';

interface RegisterState {
  error: string | null;
  success: boolean;
}

export function RegisterForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const [state, submitAction, isPending] = useActionState<RegisterState, FormData>(
    async (_prev, formData) => {
      const username = formData.get('username') as string;
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;
      const confirmPassword = formData.get('confirmPassword') as string;

      if (!isValidUsername(username)) {
        return { error: 'Username must be 3–50 alphanumeric characters or underscores', success: false };
      }
      if (!isValidEmail(email)) {
        return { error: 'Please enter a valid email address', success: false };
      }
      if (!isValidPassword(password)) {
        return { error: 'Password must be at least 8 characters', success: false };
      }
      if (!passwordsMatch(password, confirmPassword)) {
        return { error: 'Passwords do not match', success: false };
      }

      try {
        await authService.register({ username, email, password });
        formRef.current?.reset();
        return { error: null, success: true };
      } catch (err) {
        if (axios.isAxiosError(err)) {
          return { error: err.response?.data?.detail ?? 'Registration failed', success: false };
        }
        return { error: 'An unexpected error occurred', success: false };
      }
    },
    { error: null, success: false }
  );

  return (
    <div style={{ width: '100%', maxWidth: '24rem', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Create account</h1>
      <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        Join us today
      </p>

      {state.error && (
        <div role="alert" style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '1rem', padding: '0.75rem', background: '#fef2f2', borderRadius: '0.375rem', border: '1px solid #fecaca' }}>
          {state.error}
        </div>
      )}

      {state.success && (
        <div role="status" style={{ color: '#16a34a', fontSize: '0.875rem', marginBottom: '1rem', padding: '0.75rem', background: '#f0fdf4', borderRadius: '0.375rem', border: '1px solid #bbf7d0' }}>
          Account created! <Link to={ROUTES.LOGIN}>Sign in now</Link>
        </div>
      )}

      <form action={submitAction} ref={formRef} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} noValidate>
        <Input name="username" label="Username" type="text" autoComplete="username" required disabled={isPending} />
        <Input name="email" label="Email" type="email" autoComplete="email" required disabled={isPending} />
        <Input name="password" label="Password" type="password" autoComplete="new-password" helperText="Min 8 characters" required disabled={isPending} />
        <Input name="confirmPassword" label="Confirm Password" type="password" autoComplete="new-password" required disabled={isPending} />
        <Button type="submit" fullWidth isLoading={isPending}>
          Create account
        </Button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
        Already have an account? <Link to={ROUTES.LOGIN}>Sign in</Link>
      </p>
    </div>
  );
}
