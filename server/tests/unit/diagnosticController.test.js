const diagnosticController = require('../../controller/diagnosticController');
const { Diagnostic, DiagnosticInteraction } = require('../../models');

// Mise à jour du mock pour inclure DiagnosticInteraction
jest.mock('../../models', () => ({
  Diagnostic: {
    findOne: jest.fn(),
  },
  DiagnosticInteraction: {
    destroy: jest.fn().mockResolvedValue(true)
  }
}));

describe('Diagnostic Controller - deleteDiagnostic', () => {
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
  
  test('devrait supprimer un diagnostic existant et retourner 200', async () => {
    // Configuration du mock pour simuler un diagnostic trouvé
    const mockDiagnostic = { 
      id: 1, 
      userId: '123',
      destroy: jest.fn().mockResolvedValue(true)
    };
    
    Diagnostic.findOne.mockResolvedValue(mockDiagnostic);
    
    // Appel de la fonction à tester
    await diagnosticController.deleteDiagnostic(req, res);
    
    // Vérifications
    expect(Diagnostic.findOne).toHaveBeenCalledWith({ 
      where: { id: '1', userId: '123' } 
    });
    expect(DiagnosticInteraction.destroy).toHaveBeenCalledWith({
      where: { diagnosticId: '1' }
    });
    expect(mockDiagnostic.destroy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ 
        message: 'Diagnostic supprimé avec succès'
      })
    );
  });
  
  test('devrait retourner 404 si le diagnostic n\'existe pas', async () => {
    // Configuration du mock pour simuler un diagnostic non trouvé
    Diagnostic.findOne.mockResolvedValue(null);
    
    // Appel de la fonction à tester
    await diagnosticController.deleteDiagnostic(req, res);
    
    // Vérifications
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ 
      message: 'Diagnostic non trouvé ou accès non autorisé',
      success: false
    }));
  });
  
  test('devrait gérer les erreurs et retourner 500', async () => {
    // Configuration du mock pour simuler une erreur
    Diagnostic.findOne.mockRejectedValue(new Error('Database error'));
    
    // Appel de la fonction à tester
    await diagnosticController.deleteDiagnostic(req, res);
    
    // Vérifications
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json.mock.calls[0][0].message).toContain('Erreur serveur');
  });
});