import { configureStore } from '@reduxjs/toolkit';
import diagnosticReducer, { 
  fetchRecentDiagnostics, 
  fetchDiagnosticById, 
  createDiagnostic, 
  deleteDiagnostic 
} from '../../../src/store/diagnosticSlice';

// Mock des réponses API
jest.mock('../../../src/api/apiClient', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn()
  }
}));

// Importer le client API mocké
import apiClient from '../../../src/api/apiClient';

describe('diagnosticSlice', () => {
  let store;
  
  beforeEach(() => {
    // Réinitialiser les mocks
    jest.clearAllMocks();
    
    // Configurer le store avec le reducer de diagnostic
    store = configureStore({
      reducer: {
        diagnostics: diagnosticReducer
      }
    });
  });
  
  describe('fetchRecentDiagnostics', () => {
    test('devrait mettre à jour l\'état avec les diagnostics récupérés', async () => {
      // Mock de la réponse API
      const mockDiagnostics = [
        { id: 1, title: 'Diagnostic 1', score: 75 },
        { id: 2, title: 'Diagnostic 2', score: 120 }
      ];
      
      apiClient.get.mockResolvedValue({ 
        data: { diagnostics: mockDiagnostics }
      });
      
      // Dispatch de l'action
      await store.dispatch(fetchRecentDiagnostics());
      
      // Vérification de l'état
      const state = store.getState().diagnostics;
      expect(state.latestDiagnostics).toEqual(mockDiagnostics);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });
    
    test('devrait gérer les erreurs', async () => {
      // Mock d'une erreur de l'API
      apiClient.get.mockRejectedValue({ 
        response: { 
          data: { message: 'Erreur serveur' } 
        } 
      });
      
      // Dispatch de l'action
      await store.dispatch(fetchRecentDiagnostics());
      
      // Vérification de l'état
      const state = store.getState().diagnostics;
      expect(state.latestDiagnostics).toEqual([]);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Erreur serveur');
    });
  });
  
  describe('fetchDiagnosticById', () => {
    test('devrait mettre à jour l\'état avec le diagnostic récupéré', async () => {
      // Mock de la réponse API
      const mockDiagnostic = {
        id: 1,
        title: 'Diagnostic détaillé',
        score: 75,
        responses: { '1': true, '2': false }
      };
      
      apiClient.get.mockResolvedValue({ 
        data: { diagnostic: mockDiagnostic }
      });
      
      // Dispatch de l'action
      await store.dispatch(fetchDiagnosticById(1));
      
      // Vérification de l'état
      const state = store.getState().diagnostics;
      expect(state.currentDiagnostic).toEqual(mockDiagnostic);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });
  });
  
  describe('createDiagnostic', () => {
    test('devrait mettre à jour l\'état avec le diagnostic créé', async () => {
      // Données pour la création
      const diagnosticData = {
        title: 'Nouveau diagnostic',
        responses: { '1': true, '2': false },
        isPublic: true
      };
      
      // Mock de la réponse API
      const mockCreatedDiagnostic = {
        id: 3,
        ...diagnosticData,
        score: 85,
        createdAt: '2025-04-23T12:00:00Z'
      };
      
      apiClient.post.mockResolvedValue({ 
        data: { diagnostic: mockCreatedDiagnostic }
      });
      
      // Dispatch de l'action
      await store.dispatch(createDiagnostic(diagnosticData));
      
      // Vérification de l'état
      const state = store.getState().diagnostics;
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });
  });
  
  describe('deleteDiagnostic', () => {
    test('devrait supprimer le diagnostic de la liste', async () => {
      // État initial avec des diagnostics
      store = configureStore({
        reducer: {
          diagnostics: diagnosticReducer
        },
        preloadedState: {
          diagnostics: {
            latestDiagnostics: [
              { id: 1, title: 'Diagnostic 1' },
              { id: 2, title: 'Diagnostic 2' }
            ],
            currentDiagnostic: { id: 1, title: 'Diagnostic 1' },
            isLoading: false,
            error: null
          }
        }
      });
      
      // Mock de la réponse API
      apiClient.delete.mockResolvedValue({ 
        data: { id: 1 }
      });
      
      // Dispatch de l'action
      await store.dispatch(deleteDiagnostic(1));
      
      // Vérification de l'état
      const state = store.getState().diagnostics;
      expect(state.latestDiagnostics).toHaveLength(1);
      expect(state.latestDiagnostics[0].id).toBe(2);
      expect(state.currentDiagnostic).toBe(null);
      expect(state.isLoading).toBe(false);
    });
  });
});