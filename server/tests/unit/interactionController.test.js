const interactionController = require('../../controller/interactionController');
const { ContentInteraction, Content, User, Comment, CommentInteraction, Diagnostic, DiagnosticInteraction } = require('../../models');

// Mock des modèles
jest.mock('../../models', () => ({
  ContentInteraction: {
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn()
  },
  CommentInteraction: {
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
  Content: {
    findByPk: jest.fn()
  },
  Comment: {
    findByPk: jest.fn()
  },
  Diagnostic: {
    findByPk: jest.fn()
  }
}));

describe('Interaction Controller - handleContentInteraction', () => {
  let req, res;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    req = {
      body: {
        contentId: '1',
        type: 'like'
      },
      user: { id: '123' }
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });
  
  test('devrait ajouter un like et retourner 201', async () => {
    // Configuration des mocks
    Content.findByPk.mockResolvedValue({ id: '1', title: 'Test Content' });
    ContentInteraction.findOne.mockResolvedValue(null);
    ContentInteraction.create.mockResolvedValue({ id: 1, userId: '123', contentId: '1', type: 'like' });
    
    // Appel de la fonction à tester
    await interactionController.handleContentInteraction(req, res);
    
    // Vérifications
    expect(Content.findByPk).toHaveBeenCalledWith('1');
    expect(ContentInteraction.findOne).toHaveBeenCalledWith({
      where: { userId: '123', contentId: '1', type: 'like' }
    });
    expect(ContentInteraction.create).toHaveBeenCalledWith({
      userId: '123', contentId: '1', type: 'like'
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      message: 'like ajouté avec succès',
      status: 'added'
    }));
  });
  
  test('devrait retirer un like existant et retourner 200', async () => {
    // Configuration des mocks pour simuler une interaction existante
    Content.findByPk.mockResolvedValue({ id: '1', title: 'Test Content' });
    
    const mockInteraction = {
      id: 1,
      userId: '123',
      contentId: '1',
      type: 'like',
      destroy: jest.fn().mockResolvedValue(true)
    };
    
    ContentInteraction.findOne.mockResolvedValue(mockInteraction);
    
    // Appel de la fonction à tester
    await interactionController.handleContentInteraction(req, res);
    
    // Vérifications
    expect(Content.findByPk).toHaveBeenCalledWith('1');
    expect(ContentInteraction.findOne).toHaveBeenCalledWith({
      where: { userId: '123', contentId: '1', type: 'like' }
    });
    expect(mockInteraction.destroy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      message: 'like retiré avec succès',
      status: 'removed'
    }));
  });
  
  test('devrait retourner 404 si le contenu n\'existe pas', async () => {
    // Configuration du mock pour simuler un contenu non trouvé
    Content.findByPk.mockResolvedValue(null);
    
    // Appel de la fonction à tester
    await interactionController.handleContentInteraction(req, res);
    
    // Vérifications
    expect(Content.findByPk).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      message: 'Contenu non trouvé'
    }));
  });
  
  test('devrait gérer les erreurs et retourner 500', async () => {
    // Configuration du mock pour simuler une erreur
    Content.findByPk.mockRejectedValue(new Error('Database error'));
    
    // Appel de la fonction à tester
    await interactionController.handleContentInteraction(req, res);
    
    // Vérifications
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false
    }));
  });
});

describe('Interaction Controller - getContentInteractionStats', () => {
  let req, res;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    req = {
      params: { contentId: '1' }
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    // Configuration des valeurs de retour pour les comptages
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
  });
  
  test('devrait retourner les statistiques d\'interactions pour un contenu', async () => {
    // Configuration du mock pour simuler un contenu trouvé
    Content.findByPk.mockResolvedValue({ id: '1', title: 'Test Content' });
    
    // Appel de la fonction à tester
    await interactionController.getContentInteractionStats(req, res);
    
    // Vérifications
    expect(Content.findByPk).toHaveBeenCalledWith('1');
    expect(ContentInteraction.count).toHaveBeenCalledTimes(4);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      stats: {
        likes: 10,
        dislikes: 5,
        favorites: 3,
        views: 20
      }
    }));
  });
  
  test('devrait retourner 404 si le contenu n\'existe pas', async () => {
    // Configuration du mock pour simuler un contenu non trouvé
    Content.findByPk.mockResolvedValue(null);
    
    // Appel de la fonction à tester
    await interactionController.getContentInteractionStats(req, res);
    
    // Vérifications
    expect(Content.findByPk).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      message: 'Contenu non trouvé'
    }));
  });
});

describe('Interaction Controller - handleDiagnosticInteraction', () => {
  let req, res;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    req = {
      body: {
        diagnosticId: '1',
        type: 'like'
      },
      user: { id: '123' }
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });
  
  test('devrait ajouter un like et retourner 201', async () => {
    // Configuration des mocks
    Diagnostic.findByPk.mockResolvedValue({ id: '1', title: 'Test Diagnostic' });
    DiagnosticInteraction.findOne.mockResolvedValue(null);
    DiagnosticInteraction.create.mockResolvedValue({ id: 1, userId: '123', diagnosticId: '1', type: 'like' });
    
    // Appel de la fonction à tester
    await interactionController.handleDiagnosticInteraction(req, res);
    
    // Vérifications
    expect(Diagnostic.findByPk).toHaveBeenCalledWith('1');
    expect(DiagnosticInteraction.findOne).toHaveBeenCalledWith({
      where: { userId: '123', diagnosticId: '1', type: 'like' }
    });
    expect(DiagnosticInteraction.create).toHaveBeenCalledWith({
      userId: '123', diagnosticId: '1', type: 'like'
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      message: 'like ajouté',
      status: true
    }));
  });
  
  test('devrait supprimer un dislike lors de l\'ajout d\'un like', async () => {
    // Configuration des mocks pour simuler l'ajout d'un like
    req.body.type = 'like';
    Diagnostic.findByPk.mockResolvedValue({ id: '1', title: 'Test Diagnostic' });
    DiagnosticInteraction.findOne.mockResolvedValue(null);
    DiagnosticInteraction.create.mockResolvedValue({ id: 1, userId: '123', diagnosticId: '1', type: 'like' });
    
    // Appel de la fonction à tester
    await interactionController.handleDiagnosticInteraction(req, res);
    
    // Vérifications que le dislike opposé est supprimé
    expect(DiagnosticInteraction.destroy).toHaveBeenCalledWith({
      where: { userId: '123', diagnosticId: '1', type: 'dislike' }
    });
  });
});