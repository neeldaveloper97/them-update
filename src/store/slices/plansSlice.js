import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { planService } from '@/services/planService';

export const fetchPlans = createAsyncThunk(
  'plans/fetchPlans',
  async (agentId, { rejectWithValue }) => {
    try {
      const plans = await planService.getPlans(agentId);
      return plans;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch plans');
    }
  }
);

const initialState = {
  plans: [],
  status: 'idle', 
  error: null,
};

const plansSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlans.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.plans = action.payload;
        state.error = null;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default plansSlice.reducer;
