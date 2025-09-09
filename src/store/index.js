import { configureStore } from '@reduxjs/toolkit';
import trustReducer from './slices/trustSlice';
import uploadReducer from './slices/uploadSlice';
import authReducer from './slices/authSlice';
import imageReducer from './slices/imageSlice';
import negotiationReducer from './slices/negotiationSlice';
import chatHistoryReducer from './slices/chatHistorySlice';
import medOptimizeReducer from './slices/medOptimizeSlice';
import contactReducer from './slices/contactSlice';
import plansReducer from './slices/plansSlice';

const loggerMiddleware = () => (next) => (action) => {
  const result = next(action);
  console.groupEnd();
  return result;
};

export const store = configureStore({
  reducer: {
    image: imageReducer,
    trust: trustReducer,
    upload: uploadReducer,
    auth: authReducer,
    negotiation: negotiationReducer,
    chatHistory: chatHistoryReducer,
    medOptimize: medOptimizeReducer,
    contact: contactReducer,
    plans: plansReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(loggerMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

const rootReducer = (state, action) => {
  if (action.type === 'RESET_STATE') {
    state = undefined; // resets entire state
  }

  return appReducer(state, action);
};

export default rootReducer;
