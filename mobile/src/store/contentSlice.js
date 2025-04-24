import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../api/apiClient'; // Correction du chemin d'import

// Récupérer les derniers contenus
export const fetchLatestContent = createAsyncThunk(
  'content/fetchLatest',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/contents');
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
export const fetchFavoriteContent = createAsyncThunk(
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

// Ajouter un like ou un dislike
export const toggleLike = createAsyncThunk(
  'content/toggleLike',
  async (contentId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/interactions/content', {
        contentId,
        type: 'like'
      });
      return { contentId, status: response.data.status };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const toggleDislike = createAsyncThunk(
  'content/toggleDislike',
  async (contentId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/interactions/content', {
        contentId,
        type: 'dislike'
      });
      return { contentId, status: response.data.status };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Ajouter un commentaire
export const addComment = createAsyncThunk(
  'content/addComment',
  async ({ contentId, text }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/comments', {
        contentId,
        content: text  // Changez 'text' en 'content'
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Créer un nouveau contenu
export const createContent = createAsyncThunk(
  'content/create',
  async (contentData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/contents', contentData);
      return response.data.content;
    } catch (error) {
      console.error('Erreur création contenu:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Ajouter vue à un contenu
export const recordContentView = createAsyncThunk(
  'content/recordView',
  async (contentId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/interactions/content', {
        contentId,
        type: 'view'
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Charger les statistiques et interactions d'un contenu
export const loadContentInteractions = createAsyncThunk(
  'content/loadInteractions',
  async (contentId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/interactions/content/${contentId}/stats`);
      return { contentId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Get content interactions
export const getContentInteractions = createAsyncThunk(
  'content/getInteractions',
  async (contentId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/interactions/content/${contentId}/user`);
      return { contentId, userInteractions: response.data.userInteractions };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Get content stats
export const getContentStats = createAsyncThunk(
  'content/getStats',
  async (contentId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/interactions/content/${contentId}/stats`);
      return { contentId, stats: response.data.stats };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const initialState = {
  latestContent: [],
  currentContent: null,
  favorites: [],
  isLoading: false,
  error: null,
  contentStats: {},
  userInteractions: {},
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    clearCurrentContent: (state) => {
      state.currentContent = null;
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
        state.error = action.payload?.message || 'Erreur lors du chargement des contenus';
      })
      
      // Récupération d'un contenu spécifique
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
        state.error = action.payload?.message || 'Erreur lors du chargement du contenu';
      })
      
      // Récupération des contenus favoris
      .addCase(fetchFavoriteContent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFavoriteContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.favorites = action.payload;
      })
      .addCase(fetchFavoriteContent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Erreur lors du chargement des favoris';
      })
      
      // Toggle favori
      .addCase(toggleFavorite.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        state.isLoading = false;
        // Mise à jour optimiste des interactions
        if (state.currentContent && state.currentContent.id === action.payload.contentId) {
          if (!state.currentContent.userInteractions) {
            state.currentContent.userInteractions = {};
          }
          state.currentContent.userInteractions.favorite = (action.payload.status === 'added');
        }
        
        state.latestContent = state.latestContent.map(content => 
          content.id === action.payload.contentId 
            ? { ...content, isFavorite: action.payload.status } 
            : content
        );
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Erreur lors de la modification du favori';
      })
      
      // Toggle like
      .addCase(toggleLike.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        state.isLoading = false;
        // Mise à jour optimiste des interactions
        if (state.currentContent && state.currentContent.id === action.payload.contentId) {
          if (!state.currentContent.userInteractions) {
            state.currentContent.userInteractions = {};
          }
          state.currentContent.userInteractions.like = (action.payload.status === 'added');
          // Si ajout de like, suppression du dislike
          if (action.payload.status === 'added') {
            state.currentContent.userInteractions.dislike = false;
          }
        }
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Erreur lors de l\'interaction';
      })
      
      // Toggle dislike 
      .addCase(toggleDislike.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(toggleDislike.fulfilled, (state, action) => {
        state.isLoading = false;
        // Mise à jour optimiste des interactions
        if (state.currentContent && state.currentContent.id === action.payload.contentId) {
          if (!state.currentContent.userInteractions) {
            state.currentContent.userInteractions = {};
          }
          state.currentContent.userInteractions.dislike = (action.payload.status === 'added');
          // Si ajout de dislike, suppression du like
          if (action.payload.status === 'added') {
            state.currentContent.userInteractions.like = false;
          }
        }
      })
      .addCase(toggleDislike.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Erreur lors de l\'interaction';
      })
      
      // Add comment
      .addCase(addComment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addComment.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addComment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Erreur lors de l\'ajout du commentaire';
      })
      
      // Création d'un nouveau contenu
      .addCase(createContent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.latestContent = [action.payload, ...state.latestContent];
      })
      .addCase(createContent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Erreur lors de la création du contenu';
      })

      // Enregistrement d'une vue
      .addCase(recordContentView.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(recordContentView.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(recordContentView.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Erreur lors de l\'enregistrement de la vue';
      })

      // Chargement des interactions d'un contenu
      .addCase(loadContentInteractions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadContentInteractions.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(loadContentInteractions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Erreur lors du chargement des interactions';
      })

      // Get content stats
      .addCase(getContentStats.fulfilled, (state, action) => {
        const { contentId, stats } = action.payload;
        state.contentStats[contentId] = stats;
        
        // Mettre à jour également les stats du contenu actuel si c'est le même
        if (state.currentContent && state.currentContent.id === contentId) {
          state.currentContent.stats = stats;
        }
      })
      
      // Get content interactions
      .addCase(getContentInteractions.fulfilled, (state, action) => {
        const { contentId, userInteractions } = action.payload;
        state.userInteractions[contentId] = userInteractions;
        
        // Mettre à jour également les interactions du contenu actuel si c'est le même
        if (state.currentContent && state.currentContent.id === contentId) {
          state.currentContent.userInteractions = userInteractions;
        }
      });
  },
});

export const { clearCurrentContent } = contentSlice.actions;
export default contentSlice.reducer;
