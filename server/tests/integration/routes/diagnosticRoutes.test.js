// tests/integration/routes/diagnosticRoutes.test.js
const request = require('supertest');
const app = require('../../../app');
const { User, Diagnostic } = require('../../../models');
const { generateToken } = require('../../../middleware/auth');

describe('Diagnostic Routes', () => {
  let token;
  let userId;
  
  beforeAll(async () => {
    // Créer un utilisateur de test et générer un token
    const user = await User.create({
      username: 'diagtestuser',
      email: 'diagtest@example.com',
      password: 'diagpass123',
      role: 'user'
    });
    userId = user.id;
    token = generateToken(user);
  });
  
  afterAll(async () => {
    // Nettoyer après les tests
    await User.destroy({ where: { id: userId } });
  });
  
  test('GET /api/diagnostics/user should return user diagnostics', async () => {
    // Créer quelques diagnostics pour l'utilisateur
    await Diagnostic.create({
      userId,
      title: 'Test Diagnostic 1',
      score: 75,
      responses: { "1": 8, "2": "option_1" },
      isPublic: true,
      completedAt: new Date()
    });
    
    const response = await request(app)
      .get('/api/diagnostics/user')
      .set('Authorization', `Bearer ${token}`);
      
    expect(response.statusCode).toBe(200);
    expect(response.body.diagnostics.length).toBeGreaterThan(0);
    expect(response.body.diagnostics[0].title).toBe('Test Diagnostic 1');
  });
  
  test('POST /api/diagnostics should create a new diagnostic', async () => {
    const newDiagnostic = {
      title: 'New Test Diagnostic',
      responses: { "1": 7, "2": "option_2", "3": 4 },
      isPublic: true
    };
    
    const response = await request(app)
      .post('/api/diagnostics')
      .set('Authorization', `Bearer ${token}`)
      .send(newDiagnostic);
      
    expect(response.statusCode).toBe(201);
    expect(response.body.diagnostic.title).toBe('New Test Diagnostic');
    expect(response.body.diagnostic.userId).toBe(userId);
    
    // Nettoyer le diagnostic créé
    await Diagnostic.destroy({ where: { id: response.body.diagnostic.id } });
  });
});