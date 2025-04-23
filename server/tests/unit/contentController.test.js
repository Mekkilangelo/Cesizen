const contentController = require('../../controller/contentController');
const { Content, User, ContentInteraction } = require('../../models');

jest.mock('../../models', () => ({
  Content: {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAndCountAll: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  },
  User: {},
  Comment: {},
  ContentInteraction: {
    findOne: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    count: jest.fn()
  }
}));

describe('Content Controller - createContent', () => {
  let req, res;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    req = {
      body: {
        title: 'Test Content',
        body: 'Test content body',
        type: 'article',
        status: 'published',
        isPublic: true
      },
      user: { id: '123' }
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });
  
  test('devrait créer un contenu et retourner 201', async () => {
    const mockContent = { id: 1, ...req.body, userId: req.user.id };
    Content.create.mockResolvedValue(mockContent);
    
    await contentController.createContent(req, res);
    
    expect(Content.create).toHaveBeenCalledWith({
      title: 'Test Content',
      body: 'Test content body',
      type: 'article',
      status: 'published',
      isPublic: true,
      tags: [],
      mediaUrl: undefined,
      userId: '123'
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      content: mockContent
    });
  });
  
  test('devrait gérer les erreurs et retourner 500', async () => {
    Content.create.mockRejectedValue(new Error('Database error'));
    
    await contentController.createContent(req, res);
    
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json.mock.calls[0][0].success).toBe(false);
    expect(res.json.mock.calls[0][0].message).toContain('Erreur lors de la création du contenu');
  });
});

describe('Content Controller - getContent', () => {
  let req, res;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    req = {
      params: { id: '1' },
      user: { id: '123' }
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });
  
  test('devrait retourner un contenu existant', async () => {
    const mockContent = { 
      id: 1, 
      title: 'Test Content',
      body: 'Test content body',
      isPublic: true,
      userId: '123'
    };
    
    Content.findByPk.mockResolvedValue(mockContent);
    ContentInteraction.count.mockResolvedValue(5);
    ContentInteraction.findAll.mockResolvedValue([
      { type: 'like' },
      { type: 'view' }
    ]);
    
    await contentController.getContent(req, res);
    
    expect(Content.findByPk).toHaveBeenCalledWith('1', expect.any(Object));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json.mock.calls[0][0].success).toBe(true);
    expect(res.json.mock.calls[0][0].content).toEqual(mockContent);
  });
  
  test('devrait retourner 404 si le contenu n\'existe pas', async () => {
    Content.findByPk.mockResolvedValue(null);
    
    await contentController.getContent(req, res);
    
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json.mock.calls[0][0].success).toBe(false);
  });
  
  test('devrait gérer les erreurs et retourner 500', async () => {
    Content.findByPk.mockRejectedValue(new Error('Database error'));
    
    await contentController.getContent(req, res);
    
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json.mock.calls[0][0].success).toBe(false);
    expect(res.json.mock.calls[0][0].message).toContain('Erreur lors de la récupération du contenu');
  });
});

describe('Content Controller - deleteContent', () => {
  let req, res;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    req = {
      params: { id: '1' },
      user: { id: '123' }
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });
  
  test('devrait supprimer un contenu existant', async () => {
    const mockContent = { 
      id: 1, 
      userId: '123',
      destroy: jest.fn().mockResolvedValue(true)
    };
    
    Content.findByPk.mockResolvedValue(mockContent);
    
    await contentController.deleteContent(req, res);
    
    expect(Content.findByPk).toHaveBeenCalledWith('1');
    expect(mockContent.destroy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json.mock.calls[0][0].success).toBe(true);
    expect(res.json.mock.calls[0][0].message).toContain('Contenu supprimé avec succès');
  });
  
  test('devrait retourner 404 si le contenu n\'existe pas', async () => {
    Content.findByPk.mockResolvedValue(null);
    
    await contentController.deleteContent(req, res);
    
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json.mock.calls[0][0].success).toBe(false);
  });
  
  test('devrait retourner 403 si l\'utilisateur n\'est pas autorisé', async () => {
    const mockContent = { 
      id: 1, 
      userId: '456' // Un autre utilisateur
    };
    
    Content.findByPk.mockResolvedValue(mockContent);
    
    await contentController.deleteContent(req, res);
    
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json.mock.calls[0][0].success).toBe(false);
  });
});