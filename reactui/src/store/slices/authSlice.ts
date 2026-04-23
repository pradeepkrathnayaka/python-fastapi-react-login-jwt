import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';
import type { LoginCredentials, AuthTokens } from '../../types';
import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../../utils/constants';
import { storage } from '../../utils/storage';

interface AuthSliceState {
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthSliceState = {
  token: storage.get<string>(AUTH_TOKEN_KEY),
  refreshToken: storage.get<string>(REFRESH_TOKEN_KEY),
  isLoading: false,
  error: null,
};

export const loginAsync = createAsyncThunk<AuthTokens, LoginCredentials>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      return await authService.login(credentials);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Login failed';
      return rejectWithValue(msg);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      storage.set(AUTH_TOKEN_KEY, action.payload);
    },
    clearToken(state) {
      state.token = null;
      state.refreshToken = null;
      storage.remove(AUTH_TOKEN_KEY);
      storage.remove(REFRESH_TOKEN_KEY);
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        storage.set(AUTH_TOKEN_KEY, action.payload.access_token);
        storage.set(REFRESH_TOKEN_KEY, action.payload.refresh_token);
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setToken, clearToken, clearError } = authSlice.actions;
export default authSlice.reducer;

