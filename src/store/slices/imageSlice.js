import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  uploadImage,
  getImage,
  deleteFile,
  uploadFileByProvider,
} from '@/services/imageService';

export const uploadImageThunk = createAsyncThunk(
  'image/uploadImage',
  async ({ file, userId }, { rejectWithValue }) => {
    try {
      const response = await uploadImage(file, userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getImageThunk = createAsyncThunk(
  'image/getImage',
  async (imageId, { rejectWithValue }) => {
    try {
      const response = await getImage(imageId);
      return response;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  }
);

export const deleteFileThunk = createAsyncThunk(
  'image/deleteFile',
  async (key, { rejectWithValue }) => {
    try {
      const response = await deleteFile(key);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const uploadFileByProviderThunk = createAsyncThunk(
  'image/uploadFileByProvider',
  async ({ file, token }, { rejectWithValue }) => {
    try {
      const response = await uploadFileByProvider(file, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  images: [], // raw array from API (current user)
  selectedImage: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  currentOperation: {
    type: null,
    status: 'idle',
    error: null,
  },
};

const imageSlice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    resetImageState: () => initialState,
    clearError: (state) => {
      state.error = null;
      state.currentOperation.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // upload
      .addCase(uploadImageThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(uploadImageThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.uploaded = action.payload;
      })
      .addCase(uploadImageThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // get
      .addCase(getImageThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getImageThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.images = action.payload; // cached for current user
      })
      .addCase(getImageThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // delete
      .addCase(deleteFileThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteFileThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })

      .addCase(deleteFileThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // provider upload
      .addCase(uploadFileByProviderThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(uploadFileByProviderThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.providerUploaded = action.payload;
      })
      .addCase(uploadFileByProviderThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { resetImageState, clearError } = imageSlice.actions;

// 🔹 handy selectors
export const selectImageStatus = (state) => state.image?.status || 'idle';
export const selectRawImages = (state) => state.image?.images || [];

export default imageSlice.reducer;
