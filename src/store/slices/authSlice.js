import { authService } from '@/services/authService';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { de } from 'zod/v4/locales';

export const register = createAsyncThunk(
  'auth/register',
  async (registrationData, { rejectWithValue }) => {
    try {
      const response = await authService.register(registrationData);

      if (!response?.success) {
        return rejectWithValue(response);
      }

      const userId = response?.data?.data?.user?.id || null;
      const sessionId = response?.data.sessionId || null;

      if (userId) {
        sessionStorage.setItem('chatUserId', userId);
      }

      if (sessionId) {
        sessionStorage.setItem('sessionId', sessionId);
      }

      return response;
    } catch (error) {
      const errorData = error?.response?.data || {
        message: 'Registration failed',
      };
      return rejectWithValue(errorData);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      if (!response.success) {
        return rejectWithValue(response);
      }
      if (response.data.session?.access_token) {
        sessionStorage.setItem(
          'access_token',
          response.data.session.access_token
        );
        sessionStorage.setItem('chatUserId', response?.data.user.id);
        sessionStorage.setItem('sessionId', response.data.sessionId);
        sessionStorage.setItem('agent', response?.data.user.agent);
        sessionStorage.setItem(
          'isExistingUser',
          response.data.isFirstMessageHandled
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Login failed' }
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword(email);
      if (!response?.success) return rejectWithValue(response);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to send OTP' }
      );
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await authService.verifyOtp({ email, otp });
      if (!response?.success) return rejectWithValue(response);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'OTP verification failed' }
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ resetToken, newPassword }, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword({
        resetToken,
        newPassword,
      });
      if (!response?.success) return rejectWithValue(response);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Password reset failed' }
      );
    }
  }
);

export const getUserById = createAsyncThunk(
  'auth/getUserById',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser(userId);
      if (!response?.success) return rejectWithValue(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to fetch user' }
      );
    }
  }
);

export const updateUserById = createAsyncThunk(
  'auth/updateUserById',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.updateUser(userData);
      if (!response?.success) return rejectWithValue(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to update user' }
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (
    { userId, oldPassword, newPassword, confirmPassword },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.changePassword({
        userId,
        oldPassword,
        newPassword,
        confirmPassword,
      });
      if (!response?.success) return rejectWithValue(response);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Change password failed' }
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const userId = sessionStorage.getItem('chatUserId');
      const sessionId = sessionStorage.getItem('sessionId');

      if (!userId || !sessionId) {
        return rejectWithValue('Missing session or user ID');
      }

      const response = await authService.logout({ userId, sessionId });

      if (!response?.success) {
        return rejectWithValue(response?.message || 'Logout failed');
      }

      sessionStorage.clear();
      localStorage.clear();
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: 'Logout request failed' }
      );
    }
  }
);

const initialState = {
  user: null,
  token: null,
  register: null,
  forgotPassword: null,
  verifyOTP: null,
  resetPassword: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoaded: false,
  loading: {
    login: false,
    register: false,
    logout: false,
    getUserById: false,
  },
  error: null,
  registerError: null,
  registerSuccess: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      Object.assign(state, {
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        isLoaded: false, // Reset
      });
      clearAuthData();
    },
    clearError: (state) => {
      state.error = null;
    },
    setIsLoaded: (state, action) => {
      state.isLoaded = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading.login = true;
        state.error = null;
        state.isAuthenticated = false;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        const user = payload?.user;
        const accessToken = payload?.session?.access_token;
        const refreshToken = payload?.session?.refresh_token;

        state.loading.login = false;
        state.isAuthenticated = true;
        state.user = user || null;
        state.token = accessToken || null;
        state.refreshToken = refreshToken || null;
        state.error = null;

        // if (accessToken) {
        //   setAuthToken(accessToken);
        // }
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.loading.login = false;
        state.isAuthenticated = false;
        state.error = payload?.message || 'Login failed';
      })
      // Register cases
      .addCase(register.pending, (state) => {
        state.loading.register = true;
        state.registerError = null;
        state.registerSuccess = false;
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.loading.register = false;
        state.registerSuccess = true;
        state.registerSuccess = payload;
        state.registerError = null;
      })
      .addCase(register.rejected, (state, { payload }) => {
        state.loading.register = false;
        state.registerSuccess = false;
        state.registerError = payload?.message || 'Registration failed';
      })

      .addCase(forgotPassword.pending, (state) => {
        state.loading.forgot = true;
        state.forgotSuccess = false;
        state.forgotError = null;
      })
      .addCase(forgotPassword.fulfilled, (state, { payload }) => {
        state.loading.forgot = false;
        state.forgotPassword = payload;
        state.forgotSuccess = true;
        state.forgotError = null;
      })
      .addCase(forgotPassword.rejected, (state, { payload }) => {
        state.loading.forgot = false;
        state.forgotSuccess = false;
        state.forgotError = payload?.message || 'Failed to send reset link';
      })

      .addCase(verifyOtp.pending, (state) => {
        state.loading.verifyOtp = true;
        state.otpError = null;
        state.otpVerified = false;
      })
      .addCase(verifyOtp.fulfilled, (state, { payload }) => {
        state.verifyOTP = payload;
        state.loading.verifyOtp = false;
        state.otpVerified = true;
      })
      .addCase(verifyOtp.rejected, (state, { payload }) => {
        state.loading.verifyOtp = false;
        state.otpError = payload?.message;
      })

      .addCase(resetPassword.pending, (state) => {
        state.loading.resetPassword = true;
        state.resetSuccess = false;
        state.resetError = null;
      })
      .addCase(resetPassword.fulfilled, (state, { payload }) => {
        state.resetPassword = payload;
        state.loading.resetPassword = false;
        state.resetSuccess = true;
      })
      .addCase(resetPassword.rejected, (state, { payload }) => {
        state.loading.resetPassword = false;
        state.resetError = payload?.message;
      })

      .addCase(getUserById.pending, (state) => {
        state.loading.getUserById = true;
      })
      .addCase(getUserById.fulfilled, (state, { payload }) => {
        state.loading.getUserById = false;
        state.user = payload;
      })
      .addCase(getUserById.rejected, (state, { payload }) => {
        state.loading.getUserById = false;
        state.error = payload?.message || 'Failed to fetch user';
      })

      .addCase(updateUserById.pending, (state) => {
        state.loading.updateUserById = true;
      })
      .addCase(updateUserById.fulfilled, (state, { payload }) => {
        state.loading.updateUserById = false;
        state.user = payload;
      })
      .addCase(updateUserById.rejected, (state, { payload }) => {
        state.loading.updateUserById = false;
        state.error = payload?.message || 'Failed to update user';
      })

      .addCase(logoutUser.pending, (state) => {
        state.loading.logout = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        Object.assign(state, {
          user: null,
          token: null,
          isAuthenticated: false,
          loading: {
            ...state.loading,
            logout: false,
          },
          error: null,
        });
      })
      .addCase(logoutUser.rejected, (state, { payload }) => {
        state.loading.logout = false;
        state.error = payload?.message || 'Logout failed';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth?.isAuthenticated;
export const selectRegisterState = (state) => ({
  loading: state.auth.loading.register,
  error: state.auth.registerError,
  success: state.auth.registerSuccess,
});
