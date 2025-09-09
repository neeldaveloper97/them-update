import { createSlice } from '@reduxjs/toolkit';
import { loadTrustState, saveTrustState } from '../persistState';

// Pre-approved message templates for CompassionModal
const messageTemplates = [
  'I notice you might be experiencing some difficulty. How can I help?',
  'I notice you might be feeling frustrated. Would you like to take a moment to step back and approach this differently?',
  'It seems like we might be hitting a roadblock. Would you like to try a different approach?',
  'I sense some tension in our interaction. Would you like to pause and reframe our discussion?',
  'Sometimes a short break can help when facing challenges. Would it help to step back for a moment?',
];

const persistedState = loadTrustState();

const initialState = {
  // ValenceMeter properties
  valence: 0.5,
  mode: 'idle', // where 'mode' can activate TrustPlus-enhanced views

  // FoMBadge properties
  emotionalStage: 'neutral',
  confidence: 0.5,

  // CompassionModal properties
  openModal: false,
  message: '',

  // WisdomDropPlayer properties
  wisdomDrops: [],

  // Other state properties
  lastUpdated: null,
  sessionId: null,

  ...persistedState,
};

export const trustSlice = createSlice({
  name: 'trust',
  initialState,
  reducers: {
    updateValence: (state, action) => {
      state.valence = action.payload;
      state.lastUpdated = new Date().toISOString();

      if (state.valence > 0.7) {
        state.emotionalStage = 'positive';
      } else if (state.valence < 0.3) {
        state.emotionalStage = 'negative';

        // Trigger CompassionModal when valence drops below 0.30
        if (state.valence < 0.3) {
          state.openModal = true;
          // Use pre-approved script templates
          state.message =
            'I notice you might be experiencing some difficulty. How can I help?';
        }
      } else {
        state.emotionalStage = 'neutral';
      }

      saveTrustState(state);
    },

    updateConfidence: (state, action) => {
      state.confidence = action.payload;
      state.lastUpdated = new Date().toISOString();
      saveTrustState(state);
    },

    updateEmotionalStage: (state, action) => {
      state.emotionalStage = action.payload;
      state.lastUpdated = new Date().toISOString();
      saveTrustState(state);
    },

    toggleMode: (state) => {
      state.mode = state.mode === 'idle' ? 'active' : 'idle';
      saveTrustState(state);
    },

    addWisdomDrop: (state, action) => {
      const newWisdomDrop = {
        id: Date.now().toString(),
        content: action.payload.content,
        timestamp: new Date().toISOString(),
        session: action.payload.session || state.sessionId || 'current',
      };

      state.wisdomDrops.push(newWisdomDrop);
      state.lastUpdated = new Date().toISOString();
      saveTrustState(state);
    },

    openCompassionModal: (state, action) => {
      state.openModal = true;

      // Use message from pre-approved script templates to avoid tone violations
      if (action.payload) {
        // Use the provided message if one is explicitly passed
        state.message = action.payload;
      } else {
        // Select a random message from pre-approved templates
        const randomIndex = Math.floor(Math.random() * messageTemplates.length);
        state.message = messageTemplates[randomIndex];
      }

      state.lastUpdated = new Date().toISOString();
      saveTrustState(state);
    },

    closeCompassionModal: (state) => {
      state.openModal = false;
      state.message = '';
    },

    setSessionId: (state, action) => {
      state.sessionId = action.payload;
      saveTrustState(state);
    },

    updateTrustData: (state, action) => {
      const { valence, confidence, emotionalStage, reflection_summary } =
        action.payload;

      if (valence !== undefined) {
        state.valence = valence;

        if (!emotionalStage) {
          if (valence > 0.7) {
            state.emotionalStage = 'positive';
          } else if (valence < 0.3) {
            state.emotionalStage = 'negative';

            // Trigger CompassionModal when valence drops below 0.30 is sustained
            if (valence < 0.3) {
              state.openModal = true;
              // Message often draws from pre-approved script templates
              state.message =
                'I notice you might be experiencing some difficulty. How can I help?';
            }
          } else {
            state.emotionalStage = 'neutral';
          }
        }
      }

      // Update confidence for FoMBadge
      if (confidence !== undefined) state.confidence = confidence;
      if (emotionalStage !== undefined) state.emotionalStage = emotionalStage;

      state.lastUpdated = new Date().toISOString();

      // Add to WisdomDropPlayer if reflection_summary exists
      if (reflection_summary) {
        const newWisdomDrop = {
          id: Date.now().toString(),
          content: reflection_summary,
          timestamp: new Date().toISOString(),
          session: state.sessionId || 'current',
        };

        state.wisdomDrops.push(newWisdomDrop);
      }

      saveTrustState(state);
    },

    clearTrustData: (state) => {
      Object.assign(state, {
        // ValenceMeter reset
        valence: 0.5,
        mode: 'idle',

        // FoMBadge reset
        emotionalStage: 'neutral',
        confidence: 0.5,

        // CompassionModal reset
        openModal: false,
        message: '',

        // WisdomDropPlayer reset
        wisdomDrops: [],

        // Other state reset
        lastUpdated: null,
        sessionId: null,
      });

      if (typeof window !== 'undefined') {
        localStorage.removeItem('trustState');
      }
    },

    loadPersistedTrustData: (state) => {
      const persistedData = loadTrustState();
      if (persistedData) {
        Object.assign(state, persistedData);
      }
    },
  },
});

export const {
  updateValence,
  updateConfidence,
  updateEmotionalStage,
  toggleMode,
  addWisdomDrop,
  openCompassionModal,
  closeCompassionModal,
  setSessionId,
  updateTrustData,
  clearTrustData,
  loadPersistedTrustData,
} = trustSlice.actions;

export default trustSlice.reducer;
