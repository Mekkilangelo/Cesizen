const request = require('supertest');
const app = require('../../../app');
const { User, Content, Diagnostic, ContentInteraction, DiagnosticInteraction } = require('../../../models');
const jwt = require('jsonwebtoken');

// Mocks pour les modèles
jest.mock('../../../models', () => ({
  User: {
    findByPk: jest.fn(),
    findOne: jest.fn()
  },
  Content: {
    findByPk: jest.fn()
  },
  Diagnostic: {
    findByPk: jest.fn()
  },
  ContentInteraction: {
    findOne: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn()
  },
  DiagnosticInteraction: {
    findOne: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn()
  }
}));

// Mock pour jsonwebtoken plus robuste qui fonctionne dans tous les cas
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn().mockImplementation((token, secret) => {
    if (token === 'invalid-token') {
      throw new Error('Invalid token');
    }
    return { id: '123', username: 'testuser', email: 'test@example.com', role: 'user' };
  }),
  sign: jest.fn().mockReturnValue('fake-jwt-token')
}));

describe('Interaction Routes - Tests d\'intégration', () => {
  let token;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Simuler un utilisateur authentifié
    const mockUser = { id: '123', email: 'test@example.com', role: 'user' };
    User.findByPk.mockResolvedValue(mockUser);
    User.findOne.mockResolvedValue(mockUser);
    
    // Créer un token d'authentification pour les tests
    token = 'fake-jwt-token';
  });
  
  // Tests pour les interactions sur les contenus
  describe('POST /api/interactions/content', () => {
    test('devrait ajouter un like à un contenu existant', async () => {
      // Simuler un contenu existant
      Content.findByPk.mockResolvedValue({ id: '1', title: 'Test Content' });
      
      // Simuler qu'aucune interaction n'existe déjà
      ContentInteraction.findOne.mockResolvedValue(null);
      
      // Simuler la création d'une interaction
      ContentInteraction.create.mockResolvedValue({ id: 1, userId: '123', contentId: '1', type: 'like' });
      
      // Effectuer la requête
      const response = await request(app)
        .post('/api/interactions/content')
        .set('Authorization', `Bearer ${token}`)
        .send({ contentId: '1', type: 'like' });
      
      // Vérifications
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'like ajouté avec succès');
      expect(Content.findByPk).toHaveBeenCalledWith('1');
      expect(ContentInteraction.create).toHaveBeenCalledWith({
        userId: '123', contentId: '1', type: 'like'
      });
    });
    
    test('devrait retourner 401 si l\'utilisateur n\'est pas authentifié', async () => {
      // Effectuer la requête sans token valide
      const response = await request(app)
        .post('/api/interactions/content')
        .set('Authorization', 'Bearer invalid-token')
        .send({ contentId: '1', type: 'like' });
      
      // Vérifications
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });
    
    test('devrait retourner 404 si le contenu n\'existe pas', async () => {
      // Simuler un contenu non trouvé
      Content.findByPk.mockResolvedValue(null);
      
      // Effectuer la requête
      const response = await request(app)
        .post('/api/interactions/content')
        .set('Authorization', `Bearer ${token}`)
        .send({ contentId: '999', type: 'like' });
      
      // Vérifications
      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Contenu non trouvé');
    });
  });
  
  // Tests pour la récupération des statistiques d'interaction d'un contenu
  describe('GET /api/interactions/content/:contentId/stats', () => {
    test('devrait retourner les statistiques d\'interaction pour un contenu', async () => {
      // Simuler un contenu existant
      Content.findByPk.mockResolvedValue({ id: '1', title: 'Test Content' });
      
      // Simuler les comptages d'interactions
      ContentInteraction.count.mockImplementation((query) => {
        const { type } = query.where;
        switch(type) {
          case 'like': return Promise.resolve(10);
          case 'dislike': return Promise.resolve(5);
          case 'favorite': return Promise.resolve(3);
          case 'view': return Promise.resolve(20);
          default: return Promise.resolve(0);
        }
      });
      
      // Effectuer la requête
      const response = await request(app)
        .get('/api/interactions/content/1/stats');
      
      // Vérifications
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('stats');
      expect(response.body.stats).toEqual({
        likes: 10,
        dislikes: 5,
        favorites: 3,
        views: 20
      });
    });
    
    test('devrait retourner 404 si le contenu n\'existe pas', async () => {
      // Simuler un contenu non trouvé
      Content.findByPk.mockResolvedValue(null);
      
      // Effectuer la requête
      const response = await request(app)
        .get('/api/interactions/content/999/stats');
      
      // Vérifications
      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Contenu non trouvé');
    });
  });
  
  // Tests pour les interactions sur les diagnostics
  describe('POST /api/interactions/diagnostic', () => {
    test('devrait ajouter un like à un diagnostic', async () => {
      // Simuler un diagnostic existant
      Diagnostic.findByPk.mockResolvedValue({ id: '1', title: 'Test Diagnostic' });
      
      // Simuler qu'aucune interaction n'existe déjà
      DiagnosticInteraction.findOne.mockResolvedValue(null);
      
      // Simuler la création d'une interaction
      DiagnosticInteraction.create.mockResolvedValue({ id: 1, userId: '123', diagnosticId: '1', type: 'like' });
      
      // Effectuer la requête
      const response = await request(app)
        .post('/api/interactions/diagnostic')
        .set('Authorization', `Bearer ${token}`)
        .send({ diagnosticId: '1', type: 'like' });
      
      // Vérifications
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('status', true);
      expect(Diagnostic.findByPk).toHaveBeenCalledWith('1');
      expect(DiagnosticInteraction.create).toHaveBeenCalledWith({
        userId: '123', diagnosticId: '1', type: 'like'
      });
    });
  });
  
  // Tests pour la récupération des interactions utilisateur pour un diagnostic
  describe('GET /api/interactions/diagnostic/:diagnosticId/user', () => {
    test('devrait retourner les interactions de l\'utilisateur pour un diagnostic', async () => {
      // Simuler un diagnostic existant
      Diagnostic.findByPk.mockResolvedValue({ id: '1', title: 'Test Diagnostic' });
      
      // Simuler les interactions existantes
      DiagnosticInteraction.findAll = jest.fn().mockResolvedValue([
        { type: 'like' },
        { type: 'favorite' }
      ]);
      
      // Effectuer la requête
      const response = await request(app)
        .get('/api/interactions/diagnostic/1/user')
        .set('Authorization', `Bearer ${token}`);
      
      // Vérifications
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('userInteractions');
      expect(response.body.userInteractions).toEqual({
        like: true,
        favorite: true
      });
    });
    
    test('devrait retourner 401 si l\'utilisateur n\'est pas authentifié', async () => {
      // Effectuer la requête sans token valide
      const response = await request(app)
        .get('/api/interactions/diagnostic/1/user')
        .set('Authorization', 'Bearer invalid-token');
      
      // Vérifications
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });
  });
});