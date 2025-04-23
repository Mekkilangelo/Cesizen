import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../api/apiClient';

// Récupérer les diagnostics récents
export const fetchRecentDiagnostics = createAsyncThunk(
  'diagnostics/fetchRecent',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/diagnostics/user');
      return response.data.diagnostics;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Récupérer un diagnostic spécifique
export const fetchDiagnosticById = createAsyncThunk(
  'diagnostics/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/diagnostics/${id}`);
      return response.data.diagnostic;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Créer un nouveau diagnostic
export const createDiagnostic = createAsyncThunk(
  'diagnostics/create',
  async (diagnosticData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/diagnostics', diagnosticData);
      return response.data.diagnostic;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Mise à jour d'un diagnostic
export const updateDiagnostic = createAsyncThunk(
  'diagnostics/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/diagnostics/${id}`, data);
      return response.data.diagnostic;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Initialisation du state
const initialState = {
  latestDiagnostics: [],
  currentDiagnostic: null,
  isLoading: false,
  error: null,
};

// Slice
const diagnosticSlice = createSlice({
  name: 'diagnostics',
  initialState,
  reducers: {
    resetCurrentDiagnostic: (state) => {
      state.currentDiagnostic = null;
    },
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Récupération des diagnostics récents
      .addCase(fetchRecentDiagnostics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecentDiagnostics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.latestDiagnostics = action.payload;
      })
      .addCase(fetchRecentDiagnostics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Erreur lors de la récupération des diagnostics';
      })
      
      // Récupération d'un diagnostic par ID
      .addCase(fetchDiagnosticById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDiagnosticById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentDiagnostic = action.payload;
      })
      .addCase(fetchDiagnosticById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Erreur lors de la récupération du diagnostic';
      })
      
      // Création d'un diagnostic
      .addCase(createDiagnostic.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createDiagnostic.fulfilled, (state, action) => {
        state.isLoading = false;
        state.latestDiagnostics.unshift(action.payload);
        state.currentDiagnostic = action.payload;
      })
      .addCase(createDiagnostic.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Erreur lors de la création du diagnostic';
      })
      
      // Mise à jour d'un diagnostic
      .addCase(updateDiagnostic.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateDiagnostic.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentDiagnostic = action.payload;
        
        // Mettre à jour dans la liste des diagnostics récents si présent
        const index = state.latestDiagnostics.findIndex(diag => diag.id === action.payload.id);
        if (index !== -1) {
          state.latestDiagnostics[index] = action.payload;
        }
      })
      .addCase(updateDiagnostic.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Erreur lors de la mise à jour du diagnostic';
      });
  },
});

export const { resetCurrentDiagnostic, resetError } = diagnosticSlice.actions;
export default diagnosticSlice.reducer;
