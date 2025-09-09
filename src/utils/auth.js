export const getInitialAuthState = () => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    };
  }

  const token = localStorage.getItem('token');

  return {
    user: null, // You might want to decode user info from token or fetch it
    token,
    isAuthenticated: !!token,
    loading: false,
    error: null,
  };
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
};
