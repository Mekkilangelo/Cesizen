// tests/integration/controllers/authController.test.js
const { User } = require('../../../models');
const authController = require('../../../controller/authController');
const { generateToken } = require('../../../middleware/auth');

// Mock de la réponse Express
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Auth Controller', () => {
  beforeEach(async () => {
    // Nettoyer la base de données de test avant chaque test
    await User.destroy({ where: {}, force: true });
  });

  test('register should create a new user and return token', async () => {
    const req = {
      body: {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123'
      }
    };
    const res = mockResponse();
    
    await authController.register(req, res);
    
    // Vérifier que le statut est 201 (Created)
    expect(res.status).toHaveBeenCalledWith(201);
    // Vérifier que le token est généré
    expect(res.json.mock.calls[0][0].token).toBeDefined();
    // Vérifier que l'utilisateur est retourné sans le mot de passe
    expect(res.json.mock.calls[0][0].user.password).toBeUndefined();
  });
  
  test('login should authenticate user and return token', async () => {
    // Créer d'abord un utilisateur
    await User.create({
      username: 'logintest',
      email: 'login@example.com',
      password: 'loginpass123',
      role: 'user',
      isActive: true
    });
    
    const req = {
      body: {
        email: 'login@example.com',
        password: 'loginpass123'
      }
    };
    const res = mockResponse();
    
    await authController.login(req, res);
    
    // Vérifier que le statut est 200 (OK)
    expect(res.status).toHaveBeenCalledWith(200);
    // Vérifier que le token est présent
    expect(res.json.mock.calls[0][0].token).toBeDefined();
  });
});