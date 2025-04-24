import authReducer, {
  loginUser,
  registerUser,
  fetchUserProfile,
  logout,
  loginSuccess
} from '../../store/authSlice';
import { configureStore } from '@reduxjs/toolkit';

// Mock du module apiClient pour simuler les requêtes API
jest.mock('../../api/apiClient', () => ({
  post: jest.fn(),
  get: jest.fn()
}));

// Mock du module SecureStore pour simuler le stockage sécurisé
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(() => Promise.resolve()),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
  getItemAsync: jest.fn(() => Promise.resolve(null))
}));

// Mock du module secureStorage
jest.mock('../../utils/secureStorage', () => ({
  STORAGE_KEYS: {
    AUTH_TOKEN: 'auth_token'
  },
  setSecureItem: jest.fn(() => Promise.resolve()),
  deleteSecureItem: jest.fn(() => Promise.resolve()),
  getSecureItem: jest.fn(() => Promise.resolve(null))
}));

describe('Auth Slice', () => {
  let store;
  
  beforeEach(() => {
    // Réinitialiser le store avant chaque test
    store = configureStore({
      reducer: {
        auth: authReducer
      }
    });
    
    // Réinitialiser les mocks
    jest.clearAllMocks();
  });
  
  describe('Reducers', () => {
    test('devrait gérer l\'action logout', () => {
      // Configurer un état initial avec un utilisateur connecté
      const initialState = {
        isAuthenticated: true,
        user: { id: '1', username: 'testuser' },
        token: 'test-token',
        isLoading: false,
        error: null
      };
      
      // Appliquer l'action logout
      const nextState = authReducer(initialState, logout());
      
      // Vérifier que l'état a été correctement mis à jour
      expect(nextState.isAuthenticated).toBe(false);
      expect(nextState.user).toBeNull();
      expect(nextState.token).toBeNull();
      expect(nextState.error).toBeNull();
    });
    
    test('devrait gérer l\'action loginSuccess', () => {
      // Configurer un état initial avec un utilisateur déconnecté
      const initialState = {
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
        error: null
      };
      
      // Données de connexion
      const loginData = {
        token: 'new-test-token'
      };
      
      // Appliquer l'action loginSuccess
      const nextState = authReducer(initialState, loginSuccess(loginData));
      
      // Vérifier que l'état a été correctement mis à jour
      expect(nextState.isAuthenticated).toBe(true);
      expect(nextState.token).toBe('new-test-token');
      expect(nextState.error).toBeNull();
    });
  });
  
  describe('Async Actions', () => {
    test('loginUser.fulfilled devrait mettre à jour correctement l\'état', async () => {
      // Configurer la réponse simulée de l'API
      const mockResponse = {
        data: {
          token: 'test-token',
          user: { id: '1', username: 'testuser' }
        }
      };
      
      // Simuler une réponse réussie de l'API
      const apiClient = require('../../api/apiClient');
      apiClient.post.mockResolvedValueOnce(mockResponse);
      
      // Exécuter l'action loginUser
      await store.dispatch(loginUser({ email: 'test@example.com', password: 'password' }));
      
      // Récupérer l'état après l'action
      const state = store.getState().auth;
      
      // Vérifier que l'état a été correctement mis à jour
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockResponse.data.user);
      expect(state.token).toBe(mockResponse.data.token);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      
      // Vérifier que l'API a été appelée avec les bons paramètres
      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password'
      });
    });
    
    test('loginUser.rejected devrait gérer correctement les erreurs', async () => {
      // Configurer la réponse d'erreur simulée de l'API
      const errorMessage = 'Identifiants incorrects';
      const mockError = {
        response: {
          data: {
            message: errorMessage
          }
        }
      };
      
      // Simuler une réponse d'erreur de l'API
      const apiClient = require('../../api/apiClient');
      apiClient.post.mockRejectedValueOnce(mockError);
      
      // Exécuter l'action loginUser
      await store.dispatch(loginUser({ email: 'test@example.com', password: 'wrong-password' }));
      
      // Récupérer l'état après l'action
      const state = store.getState().auth;
      
      // Vérifier que l'état a été correctement mis à jour
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
    
    test('registerUser.fulfilled devrait mettre à jour correctement l\'état', async () => {
      // Configurer la réponse simulée de l'API
      const mockResponse = {
        data: {
          token: 'test-token',
          user: { id: '1', username: 'newuser', email: 'new@example.com' }
        }
      };
      
      // Simuler une réponse réussie de l'API
      const apiClient = require('../../api/apiClient');
      apiClient.post.mockResolvedValueOnce(mockResponse);
      
      // Données d'inscription
      const registerData = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123'
      };
      
      // Exécuter l'action registerUser
      await store.dispatch(registerUser(registerData));
      
      // Récupérer l'état après l'action
      const state = store.getState().auth;
      
      // Vérifier que l'état a été correctement mis à jour
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockResponse.data.user);
      expect(state.token).toBe(mockResponse.data.token);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      
      // Vérifier que l'API a été appelée avec les bons paramètres
      expect(apiClient.post).toHaveBeenCalledWith('/auth/register', registerData);
    });
    
    test('fetchUserProfile.fulfilled devrait mettre à jour correctement l\'état', async () => {
      // Configurer la réponse simulée de l'API
      const mockResponse = {
        data: {
          user: { id: '1', username: 'testuser', email: 'test@example.com' }
        }
      };
      
      // Simuler une réponse réussie de l'API
      const apiClient = require('../../api/apiClient');
      apiClient.get.mockResolvedValueOnce(mockResponse);
      
      // Exécuter l'action fetchUserProfile
      await store.dispatch(fetchUserProfile());
      
      // Récupérer l'état après l'action
      const state = store.getState().auth;
      
      // Vérifier que l'état a été correctement mis à jour
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockResponse.data.user);
      expect(state.isLoading).toBe(false);
      
      // Vérifier que l'API a été appelée correctement
      expect(apiClient.get).toHaveBeenCalledWith('/auth/profile');
    });
  });
});