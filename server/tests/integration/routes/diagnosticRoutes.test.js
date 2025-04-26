// tests/integration/routes/diagnosticRoutes.test.js
const request = require('supertest');
const app = require('../../../app');
const { User, Diagnostic } = require('../../../models');
const { generateToken } = require('../../../middleware/auth');
const bcrypt = require('bcrypt');

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
      riskLevel: 'low', // Ajout du champ obligatoire riskLevel
      recommendations: 'Test recommendations',
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
    // Utiliser saveDiagnosticResult au lieu de createDiagnostic, car c'est la méthode qui est utilisée pour enregistrer des diagnostics
    const newDiagnostic = {
      title: 'New Test Diagnostic',
      responses: { "1": 7, "2": "option_2", "3": 4 },
      riskLevel: 'moderate',
      rawScore: 150, // Utiliser rawScore au lieu de score
      recommendations: 'Test recommendations',
      isPublic: true,
      diagnosticType: 'general' // Ajouter le type de diagnostic
    };
    
    const response = await request(app)
      .post('/api/diagnostics')
      .set('Authorization', `Bearer ${token}`)
      .send(newDiagnostic);
      
    expect(response.statusCode).toBe(201);
    expect(response.body.diagnostic.title).toBe('New Test Diagnostic');
    expect(response.body.diagnostic.userId).toBe(userId);
    
    // Nettoyer le diagnostic créé
    if (response.body.diagnostic && response.body.diagnostic.id) {
      await Diagnostic.destroy({ where: { id: response.body.diagnostic.id } });
    }
  });

  test('DELETE /api/diagnostics/:id devrait supprimer un diagnostic existant', async () => {
    // Créer d'abord un diagnostic à supprimer avec tous les champs requis
    const diagnostic = await Diagnostic.create({
      userId: userId,
      title: 'Test pour suppression',
      score: 150, // Assurer que score est défini
      responses: { "1": true, "5": true },
      riskLevel: 'moderate',
      recommendations: 'Test recommendations',
      isPublic: false,
      completedAt: new Date(), // Ajouter la date de complétion
      diagnosticType: 'general' // Ajouter le type de diagnostic
    });
    
    const response = await request(app)
      .delete(`/api/diagnostics/${diagnostic.id}`)
      .set('Authorization', `Bearer ${token}`);
      
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Diagnostic supprimé avec succès');
    
    // Vérifier que le diagnostic a bien été supprimé
    const deleted = await Diagnostic.findByPk(diagnostic.id);
    expect(deleted).toBeNull();
  });

  test('DELETE /api/diagnostics/:id devrait retourner 404 pour un diagnostic inexistant', async () => {
    const nonExistentId = 999999;
    
    const response = await request(app)
      .delete(`/api/diagnostics/${nonExistentId}`)
      .set('Authorization', `Bearer ${token}`);
      
    expect(response.statusCode).toBe(404);
  });

  test('DELETE /api/diagnostics/:id devrait interdire la suppression du diagnostic d\'un autre utilisateur', async () => {
    // Créer un autre utilisateur
    const otherUser = await User.create({
      username: 'otheruser',
      email: 'other@example.com',
      password: await bcrypt.hash('password123', 10)
    });
    
    // Créer un diagnostic pour cet autre utilisateur
    const diagnostic = await Diagnostic.create({
      userId: otherUser.id,
      title: 'Test d\'un autre utilisateur',
      score: 120,
      responses: { "1": true },
      riskLevel: 'low',
      recommendations: 'Test',
      isPublic: true
    });
    
    const response = await request(app)
      .delete(`/api/diagnostics/${diagnostic.id}`)
      .set('Authorization', `Bearer ${token}`);
      
    expect(response.statusCode).toBe(404);
    
    // Vérifier que le diagnostic existe toujours
    const stillExists = await Diagnostic.findByPk(diagnostic.id);
    expect(stillExists).not.toBeNull();
    
    // Nettoyer
    await diagnostic.destroy();
    await otherUser.destroy();
  });
});