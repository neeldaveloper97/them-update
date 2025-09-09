import axios from '@/lib/axiosInstance';

const handleError = (error) => {
  if (axios.isAxiosError(error)) {
    const res = error.response;
    return {
      data: res?.data?.data || null,
      statusCode: res?.status || 500,
      message:
        res?.data?.message || res?.data?.error,
      success: false,
    };
  }

  return {
    data: null,
    statusCode: 500,
    message: 'Unexpected error occurred.',
    success: false,
  };
};

const formatResponse = (res) => ({
  data: res?.data || null,
  statusCode: res.status,
  message: res.data?.message,
  success: true,
});

export const authService = {
  register: async (registrationData) => {
    try {
      const res = await axios.post('/v1/auth/signup', registrationData);
      return formatResponse(res);
    } catch (error) {
      return handleError(error);
    }
  },

  login: async (credentials) => {
    try {
      const res = await axios.post('/v1/auth/login', credentials);
      return formatResponse(res);
    } catch (error) {
      return handleError(error);
    }
  },

  logout: async ({ userId, sessionId }) => {
    try {
      const res = await axios.post('/v1/auth/logout', {
        userId,
        sessionId,
      });
      return formatResponse(res);
    } catch (error) {
      return handleError(error);
    }
  },

  refreshToken: async () => {
    try {
      const res = await axios.post('/auth/refresh-token');
      return formatResponse(res);
    } catch (error) {
      return handleError(error);
    }
  },
  getCurrentUser: async (userId) => {
    try {
      const res = await axios.get(`/v1/auth/user/${userId}`);
      return formatResponse(res);
    } catch (error) {
      return handleError(error);
    }
  },

  forgotPassword: async (email) => {
    try {
      const res = await axios.post('/v1/auth/forgot-password', {
        email,
      });
      return formatResponse(res);
    } catch (error) {
      return handleError(error);
    }
  },

  verifyOtp: async ({ email, otp }) => {
    try {
      const res = await axios.post('/v1/auth/otp', {
        email,
        otp,
      });
      return formatResponse(res);
    } catch (error) {
      return handleError(error);
    }
  },

  resetPassword: async ({ resetToken, newPassword }) => {
    try {
      const res = await axios.post('/v1/auth/reset-password', {
        resetToken,
        newPassword,
      });
      return formatResponse(res);
    } catch (error) {
      return handleError(error);
    }
  },

  updateUser: async (userData) => {
    try {
      const res = await axios.patch('/v1/auth/update-user', userData);
      return formatResponse(res);
    } catch (error) {
      return handleError(error);
    }
  },

  changePassword: async ({
    userId,
    oldPassword,
    newPassword,
    confirmPassword,
  }) => {
    try {
      const res = await axios.patch('/v1/auth/change-password', {
        userId,
        oldPassword,
        newPassword,
        confirmPassword,
      });
      return formatResponse(res);
    } catch (error) {
      return handleError(error);
    }
  },
};
