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

// Alias pour la compatibilité avec les tests - même fonction, nom différent
export const fetchDiagnostics = fetchRecentDiagnostics;

// Récupérer un diagnostic spécifique
export const fetchDiagnosticById = createAsyncThunk(
  'diagnostics/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/diagnostics/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Créer un nouveau diagnostic Holmes-Rahe
export const createDiagnostic = createAsyncThunk(
  'diagnostics/create',
  async (diagnosticData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/diagnostics', {
        ...diagnosticData,
        rawScore: diagnosticData.rawScore
      });
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

// Améliorer l'action deleteDiagnostic pour mieux gérer les erreurs

export const deleteDiagnostic = createAsyncThunk(
  'diagnostics/delete',
  async (id, { rejectWithValue }) => {
    try {
      console.log(`Envoi de la requête DELETE à /diagnostics/${id}`);
      const response = await apiClient.delete(`/diagnostics/${id}`);
      console.log('Réponse de suppression:', response.data);
      return id;
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      // Afficher plus de détails sur l'erreur
      if (error.response) {
        console.error('Données d\'erreur:', error.response.data);
        console.error('Status:', error.response.status);
      }
      return rejectWithValue(error.response?.data || { message: error.message || 'Erreur inconnue' });
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
        state.error = action.payload?.message || 'Erreur lors de la récupération des tests de stress';
      })
      
      // Récupération d'un diagnostic par ID
      .addCase(fetchDiagnosticById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDiagnosticById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentDiagnostic = action.payload.diagnostic;
      })
      .addCase(fetchDiagnosticById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Erreur lors de la récupération du test de stress';
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
        state.error = action.payload?.message || 'Erreur lors de la création du test de stress';
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
        state.error = action.payload?.message || 'Erreur lors de la mise à jour du test de stress';
      })
      
      // Suppression d'un diagnostic
      .addCase(deleteDiagnostic.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteDiagnostic.fulfilled, (state, action) => {
        state.isLoading = false;
        // Récupérer l'ID du diagnostic supprimé
        const deletedId = action.payload;
        // Supprimer de la liste des diagnostics
        state.latestDiagnostics = state.latestDiagnostics.filter(
          diagnostic => diagnostic.id !== deletedId
        );
        // Réinitialiser le diagnostic actuel s'il a été supprimé
        if (state.currentDiagnostic && state.currentDiagnostic.id === deletedId) {
          state.currentDiagnostic = null;
        }
      })
      .addCase(deleteDiagnostic.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Erreur lors de la suppression du diagnostic';
      });
  },
});

export const { resetCurrentDiagnostic, resetError } = diagnosticSlice.actions;
export default diagnosticSlice.reducer;
