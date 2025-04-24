import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../api/apiClient';
import { getSecureItem, STORAGE_KEYS } from '../utils/secureStorage';

// Récupérer les diagnostics récents
export const fetchRecentDiagnostics = createAsyncThunk(
  'diagnostic/fetchRecent',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching recent diagnostics...');
      const response = await apiClient.get('/diagnostics/user');
      console.log('Diagnostics fetched:', response.data);
      return response.data.diagnostics;
    } catch (error) {
      console.error('Error fetching diagnostics:', error);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Récupérer un diagnostic spécifique
export const fetchDiagnosticById = createAsyncThunk(
  'diagnostic/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      console.log(`Fetching diagnostic with id ${id}...`);
      const response = await apiClient.get(`/diagnostics/${id}`);
      console.log('Diagnostic fetched:', response.data);
      return response.data.diagnostic;
    } catch (error) {
      console.error(`Error fetching diagnostic ${id}:`, error);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Créer un diagnostic Holmes-Rahe
export const createHolmesRaheDiagnostic = createAsyncThunk(
  'diagnostic/createHolmesRahe',
  async (diagnosticData, { rejectWithValue }) => {
    try {
      console.log('Creating Holmes-Rahe diagnostic:', diagnosticData);
      const response = await apiClient.post('/diagnostics', diagnosticData);
      console.log('Diagnostic created:', response.data);
      return response.data.diagnostic;
    } catch (error) {
      console.error('Error creating diagnostic:', error);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Alias pour créer un diagnostic (pour compatibilité avec le code existant)
export const createDiagnostic = createHolmesRaheDiagnostic;

// Supprimer un diagnostic
export const deleteDiagnostic = createAsyncThunk(
  'diagnostic/delete',
  async (id, { rejectWithValue, getState }) => {
    try {
      console.log(`[DELETE ACTION] Suppression du diagnostic ID: ${id}`);
      console.log(`[DELETE ACTION] Type de l'ID: ${typeof id}`);
      
      // Afficher l'état Redux actuel pour le débogage
      const state = getState();
      console.log('[DELETE ACTION] État auth:', {
        isAuthenticated: state.auth.isAuthenticated,
        hasToken: !!state.auth.token,
        user: state.auth.user ? 'Présent' : 'Absent'
      });

      // Récupérer le token pour vérifier l'authentification
      const token = await getSecureItem(STORAGE_KEYS.AUTH_TOKEN);
      console.log('[DELETE ACTION] Token récupéré:', token ? 'Présent' : 'Absent');
      
      // S'assurer que l'ID est un nombre
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
      console.log(`[DELETE ACTION] URL de la requête: /diagnostics/${numericId}`);
      
      const response = await apiClient.delete(`/diagnostics/${numericId}`);
      console.log('[DELETE ACTION] Réponse de suppression:', response.data);
      
      // Ajouter un petit délai pour s'assurer que tout est bien traité
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log('[DELETE ACTION] Suppression réussie, retour de l\'ID:', numericId);
      return numericId;
    } catch (error) {
      console.error('[DELETE ACTION] Erreur lors de la suppression:', error);
      
      if (error.response) {
        console.error('[DELETE ACTION] Détails de l\'erreur response:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      } else if (error.request) {
        console.error('[DELETE ACTION] Pas de réponse reçue. Requête:', error.request);
      } else {
        console.error('[DELETE ACTION] Erreur de configuration:', error.message);
      }
      
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// État initial
const initialState = {
  latestDiagnostics: [],
  currentDiagnostic: null,
  isLoading: false,
  error: null,
};

// Le slice Redux
const diagnosticSlice = createSlice({
  name: 'diagnostic',
  initialState,
  reducers: {
    clearCurrentDiagnostic: (state) => {
      state.currentDiagnostic = null;
    },
    setLoadingState: (state, action) => {
      state.isLoading = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Gestion de fetchRecentDiagnostics
      .addCase(fetchRecentDiagnostics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecentDiagnostics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.latestDiagnostics = action.payload || [];
      })
      .addCase(fetchRecentDiagnostics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Erreur lors du chargement des diagnostics';
      })
      
      // Gestion de fetchDiagnosticById
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
        state.error = action.payload?.message || 'Erreur lors du chargement du diagnostic';
      })
      
      // Gestion de createHolmesRaheDiagnostic
      .addCase(createHolmesRaheDiagnostic.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createHolmesRaheDiagnostic.fulfilled, (state, action) => {
        state.isLoading = false;
        state.latestDiagnostics = [action.payload, ...state.latestDiagnostics];
        state.currentDiagnostic = action.payload;
      })
      .addCase(createHolmesRaheDiagnostic.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Erreur lors de la création du diagnostic';
      })
      
      // Gestion de deleteDiagnostic
      .addCase(deleteDiagnostic.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteDiagnostic.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log('Removing diagnostic from state:', action.payload);
        state.latestDiagnostics = state.latestDiagnostics.filter(
          diagnostic => diagnostic.id !== action.payload
        );
        if (state.currentDiagnostic && state.currentDiagnostic.id === action.payload) {
          state.currentDiagnostic = null;
        }
      })
      .addCase(deleteDiagnostic.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Erreur lors de la suppression du diagnostic';
      });
  },
});

export const { clearCurrentDiagnostic, setLoadingState } = diagnosticSlice.actions;
export default diagnosticSlice.reducer;
