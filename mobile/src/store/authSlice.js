import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../api/apiClient';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { STORAGE_KEYS, setSecureItem, deleteSecureItem } from '../utils/secureStorage';

// Thunk pour s'inscrire
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      // Utiliser la fonction qui gère le stockage multi-plateforme
      await setSecureItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
      console.log('Inscription réussie, token stocké');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Thunk pour se connecter
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      // Utiliser la fonction qui gère le stockage multi-plateforme
      await setSecureItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
      console.log('Connexion réussie, token stocké');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Thunk pour récupérer le profil utilisateur
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/auth/profile');
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Action pour définir le token manuellement
export const setToken = createAsyncThunk(
  'auth/setToken',
  async (token, { dispatch }) => {
    if (token) {
      await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, token);
      dispatch(fetchUserProfile());
    }
    return { token };
  }
);

// Thunk pour se déconnecter (simplifié)
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      await deleteSecureItem(STORAGE_KEYS.AUTH_TOKEN);
      console.log('Token supprimé avec succès');
      dispatch(logout());
      return null;
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      dispatch(logout());
      return null;
    }
  }
);

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Gestion de l'inscription
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Erreur lors de l\'inscription';
      })
      
      // Gestion de la connexion
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Identifiants incorrects';
      })
      
      // Gestion du profil
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message;
      })
      
      // Gestion du token
      .addCase(setToken.fulfilled, (state, action) => {
        state.token = action.payload.token;
        if (action.payload.token) {
          state.isAuthenticated = true;
        }
      })
      
      // Gestion de la déconnexion
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
      });
  },
});

export const { logout, loginSuccess } = authSlice.actions;
export default authSlice.reducer;