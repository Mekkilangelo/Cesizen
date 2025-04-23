// tests/e2e/userJourney.test.js
const request = require('supertest');
const app = require('../../app');
const { User, Diagnostic, Content, Comment } = require('../../models');

describe('Complete User Journey', () => {
  let token;
  let userId;
  let diagnosticId;
  let contentId;
  
  // Nettoyer après tous les tests
  afterAll(async () => {
    await Comment.destroy({ where: {} });
    await Diagnostic.destroy({ where: {} });
    await Content.destroy({ where: {} });
    await User.destroy({ where: { email: 'journey@example.com' } });
  });
  
  test('1. User Registration', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'journeyuser',
        email: 'journey@example.com',
        password: 'journey123'
      });
      
    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
    
    // Stocker le token et userId pour les prochains tests
    token = res.body.token;
    userId = res.body.user.id;
  });
  
  test('2. Create Diagnostic', async () => {
    const res = await request(app)
      .post('/api/diagnostics')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Journey Diagnostic',
        responses: { "1": 9, "2": "option_1" },
        isPublic: true
      });
      
    expect(res.statusCode).toBe(201);
    
    // Stocker l'ID du diagnostic
    diagnosticId = res.body.diagnostic.id;
  });
  
  test('3. Create Content', async () => {
    const res = await request(app)
      .post('/api/contents')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Journey Content',
        body: 'This is a test content for our journey.',
        type: 'article',
        status: 'published',
        isPublic: true
      });
      
    expect(res.statusCode).toBe(201);
    
    // Stocker l'ID du contenu
    contentId = res.body.content.id;
  });
  
  test('4. Like Content and Check Stats', async () => {
    // Like le contenu
    await request(app)
      .post('/api/interactions/content')
      .set('Authorization', `Bearer ${token}`)
      .send({
        contentId: contentId,
        type: 'like'
      });
      
    // Vérifier les stats
    const res = await request(app)
      .get(`/api/interactions/content/${contentId}/stats`)
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.statusCode).toBe(200);
    expect(res.body.stats.likes).toBe(1);
    expect(res.body.userInteractions.like).toBe(true);
  });
  
  test('5. Add Comment to Diagnostic', async () => {
    const res = await request(app)
      .post('/api/comments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        diagnosticId: diagnosticId,
        content: 'This is a comment on my journey diagnostic.'
      });
      
    expect(res.statusCode).toBe(201);
  });
  
  test('6. Get All User Diagnostics', async () => {
    const res = await request(app)
      .get('/api/diagnostics/user')
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.statusCode).toBe(200);
    expect(res.body.diagnostics.length).toBeGreaterThan(0);
    expect(res.body.diagnostics.some(d => d.id === diagnosticId)).toBe(true);
  });
});