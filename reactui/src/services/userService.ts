import api from './api';
import type { User, UserUpdateData, PasswordUpdateData } from '../types';
import { API_ENDPOINTS } from '../utils/constants';

export const userService = {
  async getProfile(): Promise<User> {
    const response = await api.get<User>(API_ENDPOINTS.PROFILE);
    return response.data;
  },

  async updateProfile(data: UserUpdateData): Promise<User> {
    const response = await api.patch<User>(API_ENDPOINTS.PROFILE, data);
    return response.data;
  },

  async updatePassword(data: PasswordUpdateData): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/users/me/password', data);
    return response.data;
  },

  async deleteAccount(): Promise<void> {
    await api.delete(API_ENDPOINTS.PROFILE);
  },
};
