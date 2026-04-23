import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { userService } from '../../services/userService';
import type { User, UserUpdateData } from '../../types';

interface UserSliceState {
  profile: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserSliceState = {
  profile: null,
  isLoading: false,
  error: null,
};

export const fetchProfileAsync = createAsyncThunk<User>(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await userService.getProfile();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to fetch profile';
      return rejectWithValue(msg);
    }
  }
);

export const updateProfileAsync = createAsyncThunk<User, UserUpdateData>(
  'user/updateProfile',
  async (data, { rejectWithValue }) => {
    try {
      return await userService.updateProfile(data);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to update profile';
      return rejectWithValue(msg);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser(state) {
      state.profile = null;
    },
    setUser(state, action: PayloadAction<User>) {
      state.profile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfileAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfileAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProfileAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfileAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUser, setUser } = userSlice.actions;
export default userSlice.reducer;
