import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for handling file uploads
export const uploadFile = createAsyncThunk(
  'upload/uploadFile',
  async (fileData, { rejectWithValue }) => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: fileData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);

const initialState = {
  files: [],
  currentUpload: null,
  isUploading: false,
  uploadProgress: 0,
  error: null,
  lastUploaded: null,
};

export const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    clearUploadError: (state) => {
      state.error = null;
    },
    removeFile: (state, action) => {
      state.files = state.files.filter((file) => file.id !== action.payload);
    },
    clearAllFiles: (state) => {
      state.files = [];
      state.lastUploaded = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFile.pending, (state, action) => {
        state.isUploading = true;
        state.uploadProgress = 0;
        state.error = null;
        // Store information about the file being uploaded
        state.currentUpload = {
          name: action.meta.arg.name,
          size: action.meta.arg.size,
          type: action.meta.arg.type,
          startTime: new Date().toISOString(),
        };
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.isUploading = false;
        state.uploadProgress = 100;

        // Add the uploaded file to the files array
        const newFile = {
          id: action.payload.id || Date.now().toString(),
          name: state.currentUpload.name,
          size: state.currentUpload.size,
          type: state.currentUpload.type,
          url: action.payload.url,
          uploadTime: new Date().toISOString(),
          metadata: action.payload.metadata || {},
        };

        state.files.push(newFile);
        state.lastUploaded = newFile;
        state.currentUpload = null;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.isUploading = false;
        state.error = action.payload;
        state.currentUpload = null;
      });
  },
});

export const {
  setUploadProgress,
  clearUploadError,
  removeFile,
  clearAllFiles,
} = uploadSlice.actions;

export default uploadSlice.reducer;
