// Helper utilities for handling Redux state persistence

/**
 * Loads trust state from localStorage
 * @returns {Object|undefined} The parsed state or undefined if not found
 */
export const loadTrustState = () => {
  try {
    if (typeof window !== 'undefined') {
      const serializedState = localStorage.getItem('trustState');
      if (serializedState === null) {
        return undefined;
      }
      const parsedState = JSON.parse(serializedState);
      return parsedState;
    }
  } catch (err) {
    console.warn('Failed to load trust state from localStorage:', err);
    return undefined;
  }
  return undefined;
};

/**
 * Saves trust state to localStorage
 * @param {Object} state - The state to save
 */
export const saveTrustState = (state) => {
  try {
    if (typeof window !== 'undefined') {
      const serializedState = JSON.stringify(state);
      localStorage.setItem('trustState', serializedState);
    }
  } catch (err) {
    console.warn('Failed to save trust state to localStorage:', err);
  }
};

/**
 * Loads trust state on app initialization
 * @param {Object} store - The Redux store
 */
export const initializeStateFromStorage = (store) => {
  if (typeof window !== 'undefined') {
    // Load initial state from localStorage
    const savedState = loadTrustState();

    if (savedState) {
      try {
        // Dispatch action to load persisted state
        store.dispatch({
          type: 'trust/loadPersistedTrustData',
          payload: savedState,
        });

        // Additionally set individual properties to ensure they're properly updated
        if (savedState.valence !== undefined) {
          store.dispatch({
            type: 'trust/updateValence',
            payload: savedState.valence,
          });
        }

        if (savedState.confidence !== undefined) {
          store.dispatch({
            type: 'trust/updateConfidence',
            payload: savedState.confidence,
          });
        }

        if (savedState.emotionalStage) {
          store.dispatch({
            type: 'trust/updateEmotionalStage',
            payload: savedState.emotionalStage,
          });
        }

        // Force a complete update
        store.dispatch({
          type: 'trust/updateTrustData',
          payload: savedState,
        });
      } catch (err) {
        console.error('Error initializing state from localStorage:', err);
      }
    }
  }
};
