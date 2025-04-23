import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../api/apiClient';

// Action pour aimer un diagnostic
export const likeDiagnostic = createAsyncThunk(
  'interactions/likeDiagnostic',
  async (diagnosticId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/interactions/diagnostic', {
        diagnosticId,
        type: 'like'
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Action pour ne pas aimer un diagnostic
export const dislikeDiagnostic = createAsyncThunk(
  'interactions/dislikeDiagnostic',
  async (diagnosticId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/interactions/diagnostic', {
        diagnosticId,
        type: 'dislike'
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Action pour ajouter aux favoris
export const favoriteDiagnostic = createAsyncThunk(
  'interactions/favoriteDiagnostic',
  async (diagnosticId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/interactions/diagnostic', {
        diagnosticId,
        type: 'favorite'
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Initialisation du state
const initialState = {
  isLoading: false,
  error: null,
  lastInteraction: null
};

// Création du slice
const interactionSlice = createSlice({
  name: 'interactions',
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Like
      .addCase(likeDiagnostic.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(likeDiagnostic.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lastInteraction = {
          type: 'like',
          status: action.payload.status,
          message: action.payload.message
        };
      })
      .addCase(likeDiagnostic.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Erreur lors de l\'interaction';
      })
      
      // Dislike
      .addCase(dislikeDiagnostic.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(dislikeDiagnostic.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lastInteraction = {
          type: 'dislike',
          status: action.payload.status,
          message: action.payload.message
        };
      })
      .addCase(dislikeDiagnostic.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Erreur lors de l\'interaction';
      })
      
      // Favorite
      .addCase(favoriteDiagnostic.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(favoriteDiagnostic.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lastInteraction = {
          type: 'favorite',
          status: action.payload.status,
          message: action.payload.message
        };
      })
      .addCase(favoriteDiagnostic.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Erreur lors de l\'interaction';
      });
  }
});

export const { resetError } = interactionSlice.actions;
export default interactionSlice.reducer;
