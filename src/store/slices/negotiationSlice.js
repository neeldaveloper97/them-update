import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  submitNegotiationCase,
  fetchNegotiationCases,
  fetchNegotiationCaseById,
  updateNegotiationCase,
  deleteNegotiationCase,
  startNegotiation,
  fetchNegotiationCaseByBillId,
  submitNegotiationAction,
} from '@/services/apiService';

export const startNegotiationThunk = createAsyncThunk(
  'negotiation/startNegotiation',
  async (billId, { rejectWithValue }) => {
    try {
      const response = await startNegotiation(billId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message || 'Start failed' }
      );
    }
  }
);
export const submitNegotiationActionThunk = createAsyncThunk(
  'negotiation/submitNegotiationAction',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await submitNegotiationAction(payload);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message || 'Action failed' }
      );
    }
  }
);
export const submitNegotiation = createAsyncThunk(
  'negotiation/submitNegotiation',
  async (arg, { rejectWithValue }) => {
    try {
      const id = typeof arg === 'object' ? arg?.id : arg;
      const poa = typeof arg === 'object' ? arg?.poa : undefined;

      const response = await submitNegotiationCase(id, poa);
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: error?.message || 'Network error' }
      );
    }
  }
);
export const getNegotiationCases = createAsyncThunk(
  'negotiation/getNegotiationCases',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetchNegotiationCases(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const getNegotiationCaseById = createAsyncThunk(
  'negotiation/getNegotiationCaseById',
  async (caseId, { rejectWithValue }) => {
    try {
      const response = await fetchNegotiationCaseById(caseId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const getNegotiationBillById = createAsyncThunk(
  'negotiation/getNegotiationBillById',
  async (billId, { rejectWithValue }) => {
    try {
      const response = await fetchNegotiationCaseByBillId(billId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const updateNegotiation = createAsyncThunk(
  'negotiation/updateNegotiation',
  async ({ caseId, negotiationData }, { rejectWithValue }) => {
    try {
      const response = await updateNegotiationCase(caseId, negotiationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const removeNegotiationCase = createAsyncThunk(
  'negotiation/removeNegotiationCase',
  async (caseId, { rejectWithValue }) => {
    try {
      const response = await deleteNegotiationCase(caseId);
      return { id: caseId, data: response?.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

const getId = (item) => item?.id || item?._id;
const upsertById = (arr, item) => {
  const id = getId(item);
  if (!id) return arr;
  const idx = arr.findIndex((x) => getId(x) === id);
  if (idx === -1) return [item, ...arr];
  const copy = arr.slice();
  copy[idx] = { ...copy[idx], ...item };
  return copy;
};
const removeById = (arr, id) => arr.filter((x) => getId(x) !== id);

// ---------- state ----------
const initialState = {
  submit: { loading: false, error: null, success: false, data: null },
  submitAction: { loading: false, error: null, success: false, data: null },
  fetchAll: { loading: false, error: null, data: [] },
  fetchById: { loading: false, error: null, data: null },
  fetchByBillId: { loading: false, error: null, data: null },
  update: { loading: false, error: null, success: false, data: null },
  delete: { loading: false, error: null, success: false, data: null },
  start: { loading: false, error: null, success: false, data: null },
  shouldRefetchList: false,
};

const negotiationSlice = createSlice({
  name: 'negotiation',
  initialState,
  reducers: {
    clearNegotiationState: (state) => {
      state.submit = {
        loading: false,
        error: null,
        success: false,
        data: null,
      };
      state.submitAction = {
        loading: false,
        error: null,
        success: false,
        data: null,
      };
      state.fetchAll = { loading: false, error: null, data: [] };
      state.fetchById = { loading: false, error: null, data: null };
      state.fetchByBillId = { loading: false, error: null, data: null };
      state.update = {
        loading: false,
        error: null,
        success: false,
        data: null,
      };
      state.delete = {
        loading: false,
        error: null,
        success: false,
        data: null,
      };
      state.start = { loading: false, error: null, success: false, data: null };
      state.shouldRefetchList = false;
    },
    acknowledgeListRefresh: (state) => {
      state.shouldRefetchList = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle submitNegotiationActionThunk
      .addCase(submitNegotiationActionThunk.pending, (state) => {
        state.submitAction.loading = true;
        state.submitAction.error = null;
        state.submitAction.success = false;
      })
      .addCase(submitNegotiationActionThunk.fulfilled, (state, action) => {
        state.submitAction.loading = false;
        state.submitAction.success = true;
        state.submitAction.data = action.payload;
        state.shouldRefetchList = true;
      })
      .addCase(submitNegotiationActionThunk.rejected, (state, action) => {
        state.submitAction.loading = false;
        state.submitAction.error = action.payload || {
          message: 'Action failed',
        };
        state.submitAction.success = false;
      })
      .addCase(submitNegotiation.pending, (state) => {
        state.submit.loading = true;
        state.submit.error = null;
        state.submit.success = false;
      })
      .addCase(submitNegotiation.fulfilled, (state, action) => {
        state.submit.loading = false;
        state.submit.success = true;
        state.submit.data = action.payload;

        if (action.payload) {
          state.fetchAll.data = upsertById(state.fetchAll.data, action.payload);
        }

        state.shouldRefetchList = true;
      })
      .addCase(submitNegotiation.rejected, (state, action) => {
        state.submit.loading = false;
        state.submit.error = action.payload || { message: 'Submission failed' };
        state.submit.success = false;
      })

      .addCase(getNegotiationCases.pending, (state) => {
        state.fetchAll.loading = true;
        state.fetchAll.error = null;
      })
      .addCase(getNegotiationCases.fulfilled, (state, action) => {
        state.fetchAll.loading = false;
        state.fetchAll.data = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(getNegotiationCases.rejected, (state, action) => {
        state.fetchAll.loading = false;
        state.fetchAll.error = action.payload || { message: 'Fetch failed' };
      })

      .addCase(getNegotiationCaseById.pending, (state) => {
        state.fetchById.loading = true;
        state.fetchById.error = null;
      })
      .addCase(getNegotiationCaseById.fulfilled, (state, action) => {
        state.fetchById.loading = false;
        state.fetchById.data = action.payload;
      })
      .addCase(getNegotiationCaseById.rejected, (state, action) => {
        state.fetchById.loading = false;
        state.fetchById.error = action.payload || {
          message: 'Fetch by ID failed',
        };
      })

      .addCase(getNegotiationBillById.pending, (state) => {
        state.fetchByBillId.loading = true;
        state.fetchByBillId.error = null;
      })
      .addCase(getNegotiationBillById.fulfilled, (state, action) => {
        state.fetchByBillId.loading = false;
        state.fetchByBillId.data = action.payload;
      })
      .addCase(getNegotiationBillById.rejected, (state, action) => {
        state.fetchByBillId.loading = false;
        state.fetchByBillId.error = action.payload || {
          message: 'Fetch by ID failed',
        };
      })

      .addCase(updateNegotiation.pending, (state) => {
        state.update.loading = true;
        state.update.error = null;
        state.update.success = false;
      })
      .addCase(updateNegotiation.fulfilled, (state, action) => {
        state.update.loading = false;
        state.update.success = true;
        state.update.data = action.payload;

        if (action.payload) {
          state.fetchAll.data = upsertById(state.fetchAll.data, action.payload);
        }
        state.shouldRefetchList = true;
      })
      .addCase(updateNegotiation.rejected, (state, action) => {
        state.update.loading = false;
        state.update.error = action.payload || { message: 'Update failed' };
        state.update.success = false;
      })

      .addCase(removeNegotiationCase.pending, (state) => {
        state.delete.loading = true;
        state.delete.error = null;
        state.delete.success = false;
      })
      .addCase(removeNegotiationCase.fulfilled, (state, action) => {
        state.delete.loading = false;
        state.delete.success = true;
        state.delete.data = action.payload;

        const removedId = action.payload?.id ?? action.meta?.arg;
        if (removedId) {
          state.fetchAll.data = removeById(state.fetchAll.data, removedId);
        }
        state.shouldRefetchList = true;
      })
      .addCase(removeNegotiationCase.rejected, (state, action) => {
        state.delete.loading = false;
        state.delete.error = action.payload || { message: 'Delete failed' };
        state.delete.success = false;
      })
      .addCase(startNegotiationThunk.pending, (state) => {
        state.start.loading = true;
        state.start.error = null;
        state.start.success = false;
      })
      .addCase(startNegotiationThunk.fulfilled, (state, action) => {
        state.start.loading = false;
        state.start.success = true;
        state.start.data = action.payload;

        if (action.payload) {
          state.fetchAll.data = upsertById(state.fetchAll.data, action.payload);
        }
        state.shouldRefetchList = true;
      })
      .addCase(startNegotiationThunk.rejected, (state, action) => {
        state.start.loading = false;
        state.start.error = action.payload || {
          message: 'Start negotiation failed',
        };
        state.start.success = false;
      });
  },
});

export const { clearNegotiationState, acknowledgeListRefresh } =
  negotiationSlice.actions;
export default negotiationSlice.reducer;
