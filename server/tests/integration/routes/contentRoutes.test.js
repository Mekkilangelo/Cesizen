const request = require('supertest');
const app = require('../../../app');
const { User, Content } = require('../../../models');
const { generateToken } = require('../../../middleware/auth');
const bcrypt = require('bcrypt');

describe('Content Routes', () => {
  let token;
  let userId;
  let contentId;
  
  beforeAll(async () => {
    // Créer un utilisateur de test et générer un token
    const user = await User.create({
      username: 'contenttestuser',
      email: 'contenttest@example.com',
      password: 'contentpass123',
      role: 'user'
    });
    userId = user.id;
    token = generateToken(user);
  });
  
  afterAll(async () => {
    // Nettoyer après les tests
    await Content.destroy({ where: { userId } });
    await User.destroy({ where: { id: userId } });
  });
  
  test('POST /api/contents should create a new content', async () => {
    const newContent = {
      title: 'Test Content Creation',
      body: 'This is a test content for integration testing',
      type: 'article',
      status: 'published',
      isPublic: true
    };
    
    const response = await request(app)
      .post('/api/contents')
      .set('Authorization', `Bearer ${token}`)
      .send(newContent);
      
    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.content.title).toBe('Test Content Creation');
    expect(response.body.content.userId).toBe(userId);
    
    // Stocker l'ID du contenu pour les tests suivants
    contentId = response.body.content.id;
  });
  
  test('GET /api/contents/user should return user contents', async () => {
    const response = await request(app)
      .get('/api/contents/user')
      .set('Authorization', `Bearer ${token}`);
      
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.contents.length).toBeGreaterThan(0);
    expect(response.body.contents[0].title).toBe('Test Content Creation');
  });
  
  test('GET /api/contents/:id should return a specific content', async () => {
    const response = await request(app)
      .get(`/api/contents/${contentId}`)
      .set('Authorization', `Bearer ${token}`);
      
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.content.id).toBe(contentId);
    expect(response.body.stats).toBeDefined();
  });
  
  test('PUT /api/contents/:id should update a content', async () => {
    const updatedData = {
      title: 'Updated Test Content',
      body: 'This content has been updated for testing purposes'
    };
    
    const response = await request(app)
      .put(`/api/contents/${contentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData);
      
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.content.title).toBe('Updated Test Content');
    expect(response.body.content.body).toBe('This content has been updated for testing purposes');
  });
  
  test('DELETE /api/contents/:id should delete a content', async () => {
    const response = await request(app)
      .delete(`/api/contents/${contentId}`)
      .set('Authorization', `Bearer ${token}`);
      
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain('supprimé avec succès');
    
    // Vérifier que le contenu a bien été supprimé
    const getResponse = await request(app)
      .get(`/api/contents/${contentId}`)
      .set('Authorization', `Bearer ${token}`);
      
    expect(getResponse.statusCode).toBe(404);
  });
  
  test('GET /api/contents should return public contents', async () => {
    // Créer d'abord un contenu public pour le test
    const newPublicContent = {
      title: 'Public Test Content',
      body: 'This is a public content for testing',
      type: 'article',
      status: 'published',
      isPublic: true
    };
    
    await request(app)
      .post('/api/contents')
      .set('Authorization', `Bearer ${token}`)
      .send(newPublicContent);
    
    const response = await request(app)
      .get('/api/contents')
      .set('Authorization', `Bearer ${token}`);
      
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.contents.length).toBeGreaterThan(0);
    expect(response.body.contents.some(c => c.title === 'Public Test Content')).toBe(true);
  });
});