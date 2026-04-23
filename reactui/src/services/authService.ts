import api from './api';
import type { LoginCredentials, AuthTokens, RegisterData, ResetPasswordData } from '../types';
import { API_ENDPOINTS, REFRESH_TOKEN_KEY } from '../utils/constants';
import { storage } from '../utils/storage';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    // FastAPI OAuth2 password flow requires application/x-www-form-urlencoded
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('username', credentials.username);
    params.append('password', credentials.password);
    params.append('scope', '');

    const response = await api.post<AuthTokens>(API_ENDPOINTS.LOGIN, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data;
  },

  async register(data: Omit<RegisterData, 'confirmPassword'>): Promise<void> {
    await api.post(API_ENDPOINTS.REGISTER, data);
  },

  async logout(): Promise<void> {
    await api.post(API_ENDPOINTS.LOGOUT);
  },

  async requestPasswordReset(data: ResetPasswordData): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/password-reset', data);
    return response.data;
  },

  async refreshToken(): Promise<AuthTokens> {
    const refreshToken = storage.get<string>(REFRESH_TOKEN_KEY);
    if (!refreshToken) throw new Error('No refresh token available');
    const response = await api.post<AuthTokens>(API_ENDPOINTS.REFRESH, {
      refresh_token: refreshToken,
    });
    return response.data;
  },
};
