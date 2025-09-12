import { authService } from '@/services/authService';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

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
        // Extract role from the correct location in the response
        const userRole = response.data.session.user.user_metadata?.role || USER_ROLES.USER;
        const permissions = response.data.user.permissions || [];
        const dashboardRoute = DASHBOARD_ROUTES[userRole];
        
        // Store session data
        Object.entries({
          [SESSION_KEYS.ACCESS_TOKEN]: response.data.session.access_token,
          [SESSION_KEYS.CHAT_USER_ID]: response.data.user.id,
          [SESSION_KEYS.SESSION_ID]: response.data.sessionId,
          [SESSION_KEYS.AGENT]: response.data.user.agent,
          [SESSION_KEYS.IS_EXISTING_USER]: response.data.isFirstMessageHandled,
          [SESSION_KEYS.USER_ROLE]: userRole,
          [SESSION_KEYS.PERMISSIONS]: JSON.stringify(permissions),
          'dashboardRoute': dashboardRoute
        }).forEach(([key, value]) => {
          if (value != null) {
            sessionStorage.setItem(key, value);
          }
        });

        // Set cookies for middleware
        document.cookie = `isAuthenticated=true; path=/; max-age=3600`;
        document.cookie = `userRole=${userRole}; path=/; max-age=3600`;
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

const clearStorageData = () => {
  Object.values(SESSION_KEYS).forEach(key => {
    sessionStorage.removeItem(key);
  });
  localStorage.clear();
  
  // Clear all authentication and UI state cookies
  document.cookie = 'isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'sidebar_state=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
};

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const userId = sessionStorage.getItem(SESSION_KEYS.CHAT_USER_ID);
      const sessionId = sessionStorage.getItem(SESSION_KEYS.SESSION_ID);

      // If we don't have session identifiers, still clear local data and resolve
      if (!userId || !sessionId) {
        clearStorageData();
        return { success: true, message: 'No active session found' };
      }

      const response = await authService.logout({ userId, sessionId });

      // Always clear client-side storage regardless of API result
      clearStorageData();
      return response;
    } catch (error) {
      // Clear client-side state even if the API call fails (network, server issues, etc.)
      clearStorageData();
      return {
        success: false,
        ...(error?.response?.data || { message: 'Logout request failed' }),
      };
    }
  }
);

const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  SUPER_ADMIN: 'super_admin'
};

const DASHBOARD_ROUTES = {
  [USER_ROLES.ADMIN]: '/admin/dashboard',
  [USER_ROLES.USER]: '/user/dashboard',
  [USER_ROLES.SUPER_ADMIN]: '/admin/dashboard'
};

const SESSION_KEYS = {
  ACCESS_TOKEN: 'access_token',
  CHAT_USER_ID: 'chatUserId',
  SESSION_ID: 'sessionId',
  AGENT: 'agent',
  IS_EXISTING_USER: 'isExistingUser',
  USER_ROLE: 'userRole',
  PERMISSIONS: 'permissions'
};

const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoaded: false,
  userRole: null,
  permissions: [],
  dashboardRoute: null,
  loading: {
    login: false,
    register: false,
    logout: false,
    getUserById: false,
    updateUserById: false,
    forgot: false,
    verifyOtp: false,
    resetPassword: false
  },
  errors: {
    login: null,
    register: null,
    forgot: null,
    otp: null,
    reset: null,
    update: null,
    general: null
  },
  status: {
    registerSuccess: false,
    forgotSuccess: false,
    otpVerified: false,
    resetSuccess: false
  }
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
    setInitialAuthState: (state, action) => {
      const { isAuthenticated, userRole, token, userId } = action.payload;
      state.isAuthenticated = isAuthenticated;
      state.userRole = userRole;
      state.token = token;
      state.user = { id: userId };
      state.isLoaded = true;
    },
  },

  extraReducers: (builder) => {
    const setLoading = (state, action) => {
      state.loading[action] = true;
      state.errors[action] = null;
    };

    const clearLoading = (state, action) => {
      state.loading[action] = false;
    };

    const setError = (state, action, message) => {
      state.loading[action] = false;
      state.errors[action] = message || `${action} failed`;
    };

    builder
      // Login cases
      .addCase(login.pending, (state) => {
        setLoading(state, 'login');
        state.isAuthenticated = false;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        clearLoading(state, 'login');
        // Extract role from the correct location in the response
        const userRole = payload?.session?.user?.user_metadata?.role || USER_ROLES.USER;
        
        state.isAuthenticated = true;
        state.user = payload?.user || null;
        state.token = payload?.session?.access_token || null;
        state.refreshToken = payload?.session?.refresh_token || null;
        state.userRole = userRole;
        state.permissions = payload?.user?.permissions || [];
        state.dashboardRoute = DASHBOARD_ROUTES[userRole];
      })
      .addCase(login.rejected, (state, { payload }) => {
        setError(state, 'login', payload?.message);
        state.isAuthenticated = false;
      })

      // Register cases
      .addCase(register.pending, (state) => {
        setLoading(state, 'register');
        state.status.registerSuccess = false;
      })
      .addCase(register.fulfilled, (state) => {
        clearLoading(state, 'register');
        state.status.registerSuccess = true;
      })
      .addCase(register.rejected, (state, { payload }) => {
        setError(state, 'register', payload?.message);
        state.status.registerSuccess = false;
      })

      // Forgot password cases
      .addCase(forgotPassword.pending, (state) => {
        setLoading(state, 'forgot');
        state.status.forgotSuccess = false;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        clearLoading(state, 'forgot');
        state.status.forgotSuccess = true;
      })
      .addCase(forgotPassword.rejected, (state, { payload }) => {
        setError(state, 'forgot', payload?.message);
        state.status.forgotSuccess = false;
      })

      // Verify OTP cases
      .addCase(verifyOtp.pending, (state) => {
        setLoading(state, 'verifyOtp');
        state.status.otpVerified = false;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        clearLoading(state, 'verifyOtp');
        state.status.otpVerified = true;
      })
      .addCase(verifyOtp.rejected, (state, { payload }) => {
        setError(state, 'otp', payload?.message);
        state.status.otpVerified = false;
      })

      // Reset password cases
      .addCase(resetPassword.pending, (state) => {
        setLoading(state, 'resetPassword');
        state.status.resetSuccess = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        clearLoading(state, 'resetPassword');
        state.status.resetSuccess = true;
      })
      .addCase(resetPassword.rejected, (state, { payload }) => {
        setError(state, 'reset', payload?.message);
        state.status.resetSuccess = false;
      })

      // Get user cases
      .addCase(getUserById.pending, (state) => {
        setLoading(state, 'getUserById');
      })
      .addCase(getUserById.fulfilled, (state, { payload }) => {
        clearLoading(state, 'getUserById');
        state.user = payload;
      })
      .addCase(getUserById.rejected, (state, { payload }) => {
        setError(state, 'general', payload?.message);
      })

      // Update user cases
      .addCase(updateUserById.pending, (state) => {
        setLoading(state, 'updateUserById');
      })
      .addCase(updateUserById.fulfilled, (state, { payload }) => {
        clearLoading(state, 'updateUserById');
        state.user = payload;
      })
      .addCase(updateUserById.rejected, (state, { payload }) => {
        setError(state, 'update', payload?.message);
      })

      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        setLoading(state, 'logout');
      })
      .addCase(logoutUser.fulfilled, (state) => {
        Object.assign(state, {
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          userRole: null,
          permissions: [],
          dashboardRoute: null,
          loading: {
            ...state.loading,
            logout: false
          },
          errors: {
            ...state.errors,
            general: null
          }
        });
      })
      .addCase(logoutUser.rejected, (state, { payload }) => {
        setError(state, 'general', payload?.message);
      });
  },
});

export const { logout, clearError, setInitialAuthState } = authSlice.actions;
export default authSlice.reducer;

// Base selectors
export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth?.isAuthenticated;
export const selectUser = (state) => state.auth?.user;

// Role and Permission selectors
export const selectUserRole = (state) => state.auth?.userRole;
export const selectUserPermissions = (state) => state.auth?.permissions;
export const selectDashboardRoute = (state) => state.auth?.dashboardRoute;
export const selectIsAdmin = (state) => 
  state.auth?.userRole === USER_ROLES.ADMIN || state.auth?.userRole === USER_ROLES.SUPER_ADMIN;

// Status selectors
export const selectAuthStatus = (state) => state.auth?.status;
export const selectAuthLoading = (state) => state.auth?.loading;
export const selectAuthErrors = (state) => state.auth?.errors;

// Route access selectors
export const selectCanAccessAdminRoutes = (state) => 
  (state.auth?.userRole === USER_ROLES.ADMIN || state.auth?.userRole === USER_ROLES.SUPER_ADMIN) && state.auth?.isAuthenticated;
  
export const selectCanAccessUserRoutes = (state) => 
  state.auth?.isAuthenticated;

// Combined selectors for specific features
export const selectRegisterState = (state) => ({
  loading: state.auth.loading.register,
  error: state.auth.errors.register,
  success: state.auth.status.registerSuccess
});

export const selectPasswordResetState = (state) => ({
  loading: state.auth.loading.resetPassword,
  error: state.auth.errors.reset,
  success: state.auth.status.resetSuccess
});

export const selectOtpState = (state) => ({
  loading: state.auth.loading.verifyOtp,
  error: state.auth.errors.otp,
  verified: state.auth.status.otpVerified
});

// Auth state selector for layout decisions
export const selectAuthLayoutState = (state) => ({
  isAuthenticated: state.auth?.isAuthenticated,
  userRole: state.auth?.userRole,
  dashboardRoute: state.auth?.dashboardRoute,
  isLoaded: state.auth?.isLoaded
});
