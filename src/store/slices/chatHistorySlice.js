import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatService } from '@/services/chatHistoryService';

export const getChatHistory = createAsyncThunk(
  'chatHistory/getChatHistory',
  async ({ userId, conversationId }) => {
    return await chatService.fetchChatHistory(userId, conversationId);
  }
);

const chatHistorySlice = createSlice({
  name: 'chatHistory',
  initialState: { history: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getChatHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChatHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(getChatHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default chatHistorySlice.reducer;
