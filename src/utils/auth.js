export const getInitialAuthState = () => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      userRole: null,
      dashboardRoute: null,
      loading: false,
      error: null,
    };
  }

  const token = sessionStorage.getItem('access_token');
  const userRole = sessionStorage.getItem('userRole');
  const dashboardRoute = sessionStorage.getItem('dashboardRoute');

  return {
    user: null, // You might want to decode user info from token or fetch it
    token,
    isAuthenticated: !!token,
    userRole,
    dashboardRoute,
    loading: false,
    error: null,
  };
};

export const setAuthToken = (token) => {
  if (token) {
    sessionStorage.setItem('access_token', token);
  } else {
    sessionStorage.removeItem('access_token');
  }
};

export const clearAuthData = () => {
  // Clear session storage
  sessionStorage.removeItem('access_token');
  sessionStorage.removeItem('chatUserId');
  sessionStorage.removeItem('sessionId');
  sessionStorage.removeItem('agent');
  sessionStorage.removeItem('isExistingUser');
  sessionStorage.removeItem('userRole');
  sessionStorage.removeItem('permissions');
  sessionStorage.removeItem('dashboardRoute');
  
  // Clear localStorage
  localStorage.clear();
  
  // Clear cookies
  if (typeof document !== 'undefined') {
    document.cookie = 'isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'sidebar_state=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};

// Role-based redirection utility
export const getDashboardRoute = (userRole) => {
  const DASHBOARD_ROUTES = {
    'admin': '/admin/dashboard',
    'user': '/user/dashboard',
    'super_admin': '/admin/dashboard'
  };
  
  return DASHBOARD_ROUTES[userRole] || '/user/dashboard';
};

// Check if user can access admin routes
export const canAccessAdminRoutes = (userRole) => {
  return ['admin', 'super_admin'].includes(userRole);
};

// Check if user can access user routes
export const canAccessUserRoutes = (userRole) => {
  return ['user', 'admin', 'super_admin'].includes(userRole);
};
