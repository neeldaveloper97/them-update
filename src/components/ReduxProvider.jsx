'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import PropTypes from 'prop-types';
import { initializeStateFromStorage } from '@/store/persistState';

export default function ReduxProvider({ children }) {
  useEffect(() => {
    initializeStateFromStorage(store);
  }, []);

  return <Provider store={store}>{children}</Provider>;
}

ReduxProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
