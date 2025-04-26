const request = require('supertest');
const app = require('../../app');
const { User, Content, Diagnostic, ContentInteraction, DiagnosticInteraction } = require('../../models');
const jwt = require('jsonwebtoken');

// Mocks pour les modèles
jest.mock('../../models', () => ({
  User: {
    findByPk: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn()
  },
  Content: {
    findByPk: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn()
  },
  Diagnostic: {
    findByPk: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn()
  },
  ContentInteraction: {
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn()
  },
  DiagnosticInteraction: {
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn()
  },
  Comment: {
    create: jest.fn(),
    findAll: jest.fn()
  }
}));

// Mock pour jsonwebtoken plus robuste qui gère correctement les tokens
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn().mockImplementation((token, secret) => {
    if (token === 'invalid-token') {
      throw new Error('Invalid token');
    }
    return { id: '123', username: 'testuser', email: 'test@example.com', role: 'user' };
  }),
  sign: jest.fn().mockReturnValue('fake-jwt-token')
}));

describe('Tests de non-régression - Parcours utilisateur complet', () => {
  let token, userId;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Simuler un utilisateur authentifié
    userId = '123';
    const mockUser = { 
      id: userId, 
      email: 'test@example.com', 
      username: 'testuser',
      role: 'user'
    };
    
    User.findByPk.mockResolvedValue(mockUser);
    User.findOne.mockResolvedValue(mockUser);
    
    // Simuler la vérification du token JWT avec une implémentation synchrone
    // au lieu d'un callback pour correspondre à l'implémentation réelle
    jwt.verify.mockReturnValue({ id: userId });
    
    // Créer un token d'authentification pour les tests
    token = 'fake-jwt-token';
    jwt.sign = jest.fn().mockReturnValue(token);
  });
  
  test('Parcours utilisateur complet de l\'inscription à l\'utilisation des fonctionnalités', async () => {
    // 1. Inscription d'un nouvel utilisateur
    const newUser = {
      email: 'nouveau@example.com',
      password: 'Password123',
      username: 'nouveauuser'
    };
    
    // Configurer le mock pour qu'il retourne un nouvel utilisateur et non un utilisateur existant
    User.findOne.mockResolvedValueOnce(null); // L'email n'existe pas déjà
    User.findOne.mockResolvedValueOnce(null); // Le username n'existe pas déjà
    
    User.create.mockResolvedValue({
      id: '456',
      email: newUser.email,
      username: newUser.username,
      role: 'user'
    });
    
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(newUser);
    
    expect(registerResponse.statusCode).toBe(201);
    expect(registerResponse.body).toHaveProperty('token');
    
    // 2. Connexion avec les nouvelles informations d'identification
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: newUser.email,
        password: newUser.password
      });
    
    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body).toHaveProperty('token');
    
    // Utiliser le token de l'utilisateur nouvellement créé
    token = loginResponse.body.token;
    
    // 3. Création d'un diagnostic de stress Holmes-Rahe
    const diagnosticData = {
      title: 'Mon diagnostic de stress',
      responses: { "1": 30, "2": 25, "3": 35 }, // Utiliser un objet pour les réponses, pas un tableau
      rawScore: 150, // Utiliser rawScore au lieu de score
      isHolmesRahe: true, // Spécifier qu'il s'agit d'un diagnostic Holmes-Rahe
      diagnosticType: 'holmes-rahe', // Spécifier le type
      isPublic: true
    };
    
    const createdDiagnostic = {
      id: '1',
      ...diagnosticData,
      userId: '456',
      createdAt: new Date().toISOString()
    };
    
    Diagnostic.create.mockResolvedValue(createdDiagnostic);
    
    const createDiagnosticResponse = await request(app)
      .post('/api/diagnostics')
      .set('Authorization', `Bearer ${token}`)
      .send(diagnosticData);
    
    expect(createDiagnosticResponse.statusCode).toBe(201);
    expect(createDiagnosticResponse.body).toHaveProperty('diagnostic');
    
    const diagnosticId = createDiagnosticResponse.body.diagnostic.id;
    
    // 4. Consulter le diagnostic créé
    Diagnostic.findByPk.mockResolvedValue(createdDiagnostic);
    
    const getDiagnosticResponse = await request(app)
      .get(`/api/diagnostics/${diagnosticId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(getDiagnosticResponse.statusCode).toBe(200);
    expect(getDiagnosticResponse.body).toHaveProperty('diagnostic');
    expect(getDiagnosticResponse.body.diagnostic.id).toBe(diagnosticId);
    
    // 5. Création d'un contenu
    const contentData = {
      title: 'Comment gérer le stress',
      body: 'Voici quelques conseils pour gérer efficacement le stress...',
      type: 'article',
      tags: ['stress', 'santé mentale', 'bien-être']
    };
    
    const createdContent = {
      id: '1',
      ...contentData,
      userId: '456',
      createdAt: new Date().toISOString()
    };
    
    Content.create.mockResolvedValue(createdContent);
    
    const createContentResponse = await request(app)
      .post('/api/contents')
      .set('Authorization', `Bearer ${token}`)
      .send(contentData);
    
    expect(createContentResponse.statusCode).toBe(201);
    expect(createContentResponse.body).toHaveProperty('content');
    
    const contentId = createContentResponse.body.content.id;
    
    // 6. Consulter le contenu créé
    Content.findByPk.mockResolvedValue(createdContent);
    
    const getContentResponse = await request(app)
      .get(`/api/contents/${contentId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(getContentResponse.statusCode).toBe(200);
    expect(getContentResponse.body).toHaveProperty('content');
    expect(getContentResponse.body.content.id).toBe(contentId);
    
    // 7. Interagir avec le contenu (like)
    ContentInteraction.findOne.mockResolvedValue(null);
    ContentInteraction.create.mockResolvedValue({
      id: '1',
      userId: '456',
      contentId,
      type: 'like'
    });
    
    const likeContentResponse = await request(app)
      .post('/api/interactions/content')
      .set('Authorization', `Bearer ${token}`)
      .send({
        contentId,
        type: 'like'
      });
    
    expect(likeContentResponse.statusCode).toBe(201);
    expect(likeContentResponse.body).toHaveProperty('success', true);
    
    // 8. Vérifier les statistiques d'interaction du contenu
    Content.findByPk.mockResolvedValue(createdContent);
    ContentInteraction.count.mockImplementation((query) => {
      const { type } = query.where;
      if (type === 'like') return Promise.resolve(1);
      return Promise.resolve(0);
    });
    
    const getContentStatsResponse = await request(app)
      .get(`/api/interactions/content/${contentId}/stats`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(getContentStatsResponse.statusCode).toBe(200);
    expect(getContentStatsResponse.body).toHaveProperty('stats');
    expect(getContentStatsResponse.body.stats.likes).toBe(1);
    
    // 9. Ajouter un diagnostic comme favori
    DiagnosticInteraction.findOne.mockResolvedValue(null);
    DiagnosticInteraction.create.mockResolvedValue({
      id: '1',
      userId: '456',
      diagnosticId,
      type: 'favorite'
    });
    
    const favoriteDiagnosticResponse = await request(app)
      .post('/api/interactions/diagnostic')
      .set('Authorization', `Bearer ${token}`)
      .send({
        diagnosticId,
        type: 'favorite'
      });
    
    expect(favoriteDiagnosticResponse.statusCode).toBe(201);
    expect(favoriteDiagnosticResponse.body).toHaveProperty('success', true);
    
    // 10. Vérifier les interactions de l'utilisateur avec le diagnostic
    Diagnostic.findByPk.mockResolvedValue(createdDiagnostic);
    DiagnosticInteraction.findAll.mockResolvedValue([
      { type: 'favorite' }
    ]);
    
    const getUserDiagnosticInteractionsResponse = await request(app)
      .get(`/api/interactions/diagnostic/${diagnosticId}/user`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(getUserDiagnosticInteractionsResponse.statusCode).toBe(200);
    expect(getUserDiagnosticInteractionsResponse.body).toHaveProperty('userInteractions');
    expect(getUserDiagnosticInteractionsResponse.body.userInteractions).toHaveProperty('favorite', true);
  });
});