import { useActionState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Input } from '../../../common/Input';
import { Button } from '../../../common/Button';
import { authService } from '../../../../services/authService';
import { userService } from '../../../../services/userService';
import { useAuthContext } from '../../../../context/AuthContext';
import { storage } from '../../../../utils/storage';
import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY, ROUTES } from '../../../../utils/constants';
import styles from './LoginForm.module.css';

interface LoginState {
  error: string | null;
  success: boolean;
}

export function LoginForm() {
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);

  const [state, submitAction, isPending] = useActionState<LoginState, FormData>(
    async (_prev, formData) => {
      const username = formData.get('username') as string;
      const password = formData.get('password') as string;

      if (!username?.trim() || !password?.trim()) {
        return { error: 'Username and password are required', success: false };
      }

      try {
        const tokens = await authService.login({ username, password });
        // Store tokens BEFORE fetching profile so the axios interceptor can attach the header
        storage.set(AUTH_TOKEN_KEY, tokens.access_token);
        storage.set(REFRESH_TOKEN_KEY, tokens.refresh_token);
        const user = await userService.getProfile();
        login(user, tokens.access_token, tokens.refresh_token);
        formRef.current?.reset();
        return { error: null, success: true };
      } catch (err) {
        storage.remove(AUTH_TOKEN_KEY);
        storage.remove(REFRESH_TOKEN_KEY);
        if (axios.isAxiosError(err)) {
          return {
            error: err.response?.data?.detail ?? 'Authentication failed',
            success: false,
          };
        }
        return { error: 'An unexpected error occurred', success: false };
      }
    },
    { error: null, success: false }
  );

  // Navigate to dashboard after successful login
  useEffect(() => {
    if (state.success) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [state.success, navigate]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome back</h1>
      <p className={styles.subtitle}>Sign in to your account</p>

      {state.error && (
        <div className={styles.errorAlert} role="alert">
          {state.error}
        </div>
      )}

      <form action={submitAction} ref={formRef} className={styles.form} noValidate>
        <Input
          name="username"
          label="Username"
          type="text"
          autoComplete="username"
          required
          disabled={isPending}
        />
        <Input
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          disabled={isPending}
        />
        <Button type="submit" fullWidth isLoading={isPending}>
          Sign in
        </Button>
      </form>

      <div className={styles.footer}>
        <p>
          Don&apos;t have an account? <Link to={ROUTES.REGISTER}>Register</Link>
        </p>
        <p>
          <Link to={ROUTES.RESET_PASSWORD}>Forgot password?</Link>
        </p>
      </div>
    </div>
  );
}

