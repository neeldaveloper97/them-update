import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getMedicalBills,
  getMedicalBillsById,
} from '@/services/medOptimizeService';
import { updateError } from '@/services/apiService';
import { submitNegotiation, startNegotiationThunk } from './negotiationSlice';
export const getMedicalBillsThunk = createAsyncThunk(
  'medOptimize/getBills',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await getMedicalBills(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const getMedicalBillByIdThunk = createAsyncThunk(
  'medOptimize/getBillById',
  async (billId, { rejectWithValue }) => {
    try {
      const response = await getMedicalBillsById(billId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const updateMedicalBillThunk = createAsyncThunk(
  'medOptimize/updateBill',
  async ({ billId, data }, { rejectWithValue }) => {
    try {
      const response = await updateError(billId, data);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

const getId = (x) => x?.id || x?._id;
const upsertById = (arr, item) => {
  const id = getId(item);
  if (!id) return arr;
  const idx = arr.findIndex((b) => getId(b) === id);
  if (idx === -1) return [item, ...arr];
  const copy = arr.slice();
  copy[idx] = { ...copy[idx], ...item };
  return copy;
};

const initialState = {
  bills: [],
  selectedBill: null,
  status: 'idle',
  error: null,
  currentOperation: {
    type: null,
    status: 'idle',
    error: null,
  },
  shouldRefetchList: false,
};

const medOptimizeSlice = createSlice({
  name: 'medOptimize',
  initialState,
  reducers: {
    resetMedOptimizeState: () => initialState,
    clearError: (state) => {
      state.error = null;
      state.currentOperation.error = null;
    },
    acknowledgeListRefresh: (state) => {
      state.shouldRefetchList = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMedicalBillsThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getMedicalBillsThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bills = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getMedicalBillsThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(getMedicalBillByIdThunk.pending, (state) => {
        state.currentOperation.status = 'loading';
        state.currentOperation.error = null;
        state.selectedBill = null;
      })
      .addCase(getMedicalBillByIdThunk.fulfilled, (state, action) => {
        state.currentOperation.status = 'succeeded';
        state.selectedBill = action.payload;

        if (action.payload) {
          state.bills = upsertById(state.bills, action.payload);
        }
      })
      .addCase(getMedicalBillByIdThunk.rejected, (state, action) => {
        state.currentOperation.status = 'failed';
        state.currentOperation.error = action.payload;
      })
      .addCase(updateMedicalBillThunk.pending, (state) => {
        state.currentOperation.status = 'loading';
        state.currentOperation.error = null;
      })
      .addCase(updateMedicalBillThunk.fulfilled, (state, action) => {
        state.currentOperation.status = 'succeeded';

        const updated =
          action.payload?.data ?? action.payload ?? state.selectedBill;

        if (updated) {
          state.selectedBill = updated;
          state.bills = upsertById(state.bills, updated);
        }

        state.shouldRefetchList = true;
      })
      .addCase(updateMedicalBillThunk.rejected, (state, action) => {
        state.currentOperation.status = 'failed';
        state.currentOperation.error = action.payload;
      })

      .addCase(submitNegotiation.fulfilled, (state) => {
        state.shouldRefetchList = true;
      })
      .addCase(startNegotiationThunk.fulfilled, (state) => {
        state.shouldRefetchList = true;
      });
  },
});

export const { resetMedOptimizeState, clearError, acknowledgeListRefresh } =
  medOptimizeSlice.actions;

export default medOptimizeSlice.reducer;
