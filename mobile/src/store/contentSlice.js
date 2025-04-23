import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../api/apiClient';

// Récupérer les derniers contenus
export const fetchLatestContent = createAsyncThunk(
  'content/fetchLatest',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/contents/public');
      return response.data.contents;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Récupérer un contenu spécifique
export const fetchContentById = createAsyncThunk(
  'content/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/contents/${id}`);
      return response.data.content;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Récupérer les contenus favoris
export const fetchFavoriteContents = createAsyncThunk(
  'content/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/contents/user/favorites');
      return response.data.contents;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Ajouter/Retirer un favori
export const toggleFavorite = createAsyncThunk(
  'content/toggleFavorite',
  async (contentId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/interactions/content', {
        contentId,
        type: 'favorite'
      });
      return { contentId, status: response.data.status };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// State initial
const initialState = {
  latestContent: [],
  favoriteContents: [],
  currentContent: null,
  isLoading: false,
  error: null,
};

// Slice
const contentSlice = createSlice({
  name: 'contents',
  initialState,
  reducers: {
    resetCurrentContent: (state) => {
      state.currentContent = null;
    },
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Récupération des derniers contenus
      .addCase(fetchLatestContent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLatestContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.latestContent = action.payload;
      })
      .addCase(fetchLatestContent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Erreur lors de la récupération des contenus';
      })
      
      // Récupération d'un contenu par ID
      .addCase(fetchContentById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContentById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentContent = action.payload;
      })
      .addCase(fetchContentById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Erreur lors de la récupération du contenu';
      })
      
      // Récupération des favoris
      .addCase(fetchFavoriteContents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFavoriteContents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.favoriteContents = action.payload;
      })
      .addCase(fetchFavoriteContents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Erreur lors de la récupération des favoris';
      })
      
      // Toggle favori
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        // Mettre à jour l'état de favori dans les listes existantes
        const { contentId, status } = action.payload;
        
        if (state.currentContent && state.currentContent.id === contentId) {
          state.currentContent.isFavorite = status;
        }
        
        state.latestContent = state.latestContent.map(content => 
          content.id === contentId ? { ...content, isFavorite: status } : content
        );

        // Si le statut est false (non favori), le retirer des favoris
        if (!status) {
          state.favoriteContents = state.favoriteContents.filter(
            content => content.id !== contentId
          );
        }
      });
  },
});

export const { resetCurrentContent, resetError } = contentSlice.actions;
export default contentSlice.reducer;
