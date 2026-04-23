import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { storage } from '../utils/storage';
import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY, ROUTES } from '../utils/constants';
import type { LoginCredentials, RegisterData } from '../types';

export function useAuth() {
  const { user, token, isAuthenticated, isLoading, login, logout: contextLogout } =
    useAuthContext();
  const navigate = useNavigate();

  const loginUser = useCallback(
    async (credentials: LoginCredentials) => {
      const tokens = await authService.login(credentials);
      // Store tokens BEFORE fetching profile so the interceptor can attach the header
      storage.set(AUTH_TOKEN_KEY, tokens.access_token);
      storage.set(REFRESH_TOKEN_KEY, tokens.refresh_token);
      const userData = await userService.getProfile();
      login(userData, tokens.access_token, tokens.refresh_token);
      navigate(ROUTES.DASHBOARD);
    },
    [login, navigate]
  );

  const registerUser = useCallback(
    async (data: RegisterData) => {
      const { confirmPassword: _cp, ...payload } = data;
      void _cp;
      await authService.register(payload);
      navigate(ROUTES.LOGIN);
    },
    [navigate]
  );

  const logoutUser = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Proceed with local logout even if server call fails
    } finally {
      contextLogout();
      navigate(ROUTES.LOGIN);
    }
  }, [contextLogout, navigate]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
  };
}

