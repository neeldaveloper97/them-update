'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import PropTypes from 'prop-types';
import { initializeStateFromStorage } from '@/store/persistState';

// Initialize auth state from session storage
const initializeAuthState = (store) => {
  if (typeof window !== 'undefined') {
    const token = sessionStorage.getItem('access_token');
    const userRole = sessionStorage.getItem('userRole');
    const userId = sessionStorage.getItem('chatUserId');
    
    if (token && userRole && userId) {
      // Dispatch action to set authenticated state
      store.dispatch({
        type: 'auth/setInitialAuthState',
        payload: {
          isAuthenticated: true,
          userRole,
          token,
          userId
        }
      });
    }
  }
};

export default function ReduxProvider({ children }) {
  useEffect(() => {
    initializeStateFromStorage(store);
    initializeAuthState(store);
  }, []);

  return <Provider store={store}>{children}</Provider>;
}

ReduxProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
