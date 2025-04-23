import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../api/apiClient';
import { setSecureItem, removeSecureItem, STORAGE_KEYS } from '../utils/secureStorage';

// Thunk pour la connexion
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('Attempting login with:', credentials.email);
      const response = await apiClient.post('/auth/login', credentials);
      // Stocker le token en sécurité using the utility function
      await setSecureItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
      return response.data;
    } catch (error) {
      console.error('Login error:', error.message);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Thunk pour l'inscription
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('Attempting registration for:', userData.email);
      const response = await apiClient.post('/auth/register', userData);
      // Stocker le token en sécurité using the utility function
      await setSecureItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error.message);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Thunk pour la déconnexion
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await removeSecureItem(STORAGE_KEYS.AUTH_TOKEN);
      return null;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);

// Thunk pour récupérer le profil utilisateur
export const fetchUserProfile = createAsyncThunk(
  'auth/profile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/auth/profile');
      return response.data.user;
    } catch (error) {
      console.error('Profile fetch error:', error.message);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// State initial without development login
const initialState = {
  user: null,
  userToken: null,
  isLoading: false,
  error: null,
};

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    setToken: (state, action) => {
      state.userToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.userToken = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Échec de la connexion';
      })
      
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.userToken = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Échec de l'inscription";
      })
      
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.userToken = null;
      })
      
      // Fetch Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { resetError, setToken } = authSlice.actions;
export default authSlice.reducer;
