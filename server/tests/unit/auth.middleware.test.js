const jwt = require('jsonwebtoken');
const { verifyToken, isAdmin } = require('../../middleware/auth');
const { User } = require('../../models');

// Mock de jsonwebtoken
jest.mock('jsonwebtoken');

// Mock de models
jest.mock('../../models', () => ({
  User: {
    findByPk: jest.fn()
  }
}));

describe('Auth Middleware', () => {
  let req, res, next;
  
  beforeEach(() => {
    req = {
      headers: {
        authorization: 'Bearer validtoken123'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    
    // Réinitialiser les mocks
    jest.clearAllMocks();
  });
  
  describe('auth middleware', () => {
    test('devrait autoriser l\'accès avec un token valide et un utilisateur existant', async () => {
      const decodedToken = { id: 1 };
      jwt.verify.mockReturnValue(decodedToken);
      
      const mockUser = { id: 1, username: 'testuser' };
      User.findByPk.mockResolvedValue(mockUser);
      
      await verifyToken(req, res, next);
      
      expect(jwt.verify).toHaveBeenCalledWith('validtoken123', process.env.JWT_SECRET || 'secret');
      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
    });
    
    test('devrait retourner 401 si le token n\'est pas fourni', async () => {
      req.headers.authorization = undefined;
      
      await verifyToken(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.stringContaining('Accès non autorisé')
      });
      expect(next).not.toHaveBeenCalled();
    });
    
    test('devrait retourner 401 si le token est invalide', async () => {
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });
      
      await verifyToken(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.stringContaining('Token invalide')
      });
      expect(next).not.toHaveBeenCalled();
    });
    
    test('devrait retourner 401 si l\'utilisateur n\'existe pas', async () => {
      const decodedToken = { id: 1 };
      jwt.verify.mockReturnValue(decodedToken);
      
      User.findByPk.mockResolvedValue(null);
      
      await verifyToken(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.stringContaining('Utilisateur non trouvé')
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
  
  describe('adminAuth middleware', () => {
    test('devrait autoriser l\'accès à un administrateur', async () => {
      const decodedToken = { id: 1 };
      jwt.verify.mockReturnValue(decodedToken);
      
      const mockAdmin = { id: 1, username: 'admin', role: 'admin' };
      User.findByPk.mockResolvedValue(mockAdmin);
      
      req.user = mockAdmin;
      await isAdmin(req, res, next);
      
      expect(jwt.verify).toHaveBeenCalledWith('validtoken123', process.env.JWT_SECRET || 'secret');
      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(req.user).toEqual(mockAdmin);
      expect(next).toHaveBeenCalled();
    });
    
    test('devrait retourner 403 si l\'utilisateur n\'est pas administrateur', async () => {
      const decodedToken = { id: 1 };
      jwt.verify.mockReturnValue(decodedToken);
      
      const mockUser = { id: 1, username: 'user', role: 'user' };
      User.findByPk.mockResolvedValue(mockUser);
      
      req.user = mockUser;
      await isAdmin(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.stringContaining('Accès réservé aux administrateurs')
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});