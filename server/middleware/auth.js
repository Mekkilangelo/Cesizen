const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Middleware pour vérifier le token JWT
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'Accès non autorisé, token manquant' 
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      
      // Vérifier si l'utilisateur existe toujours et est actif
      const user = await User.findByPk(decoded.id);
      
      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: 'Utilisateur non trouvé' 
        });
      }
      
      // Ajouter l'utilisateur à l'objet request
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ 
        success: false,
        message: 'Token invalide ou expiré' 
      });
    }
  } catch (error) {
    return res.status(500).json({ 
      success: false,
      message: 'Erreur serveur lors de l\'authentification' 
    });
  }
};

// Middleware pour vérifier les rôles
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'Non authentifié' 
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        message: 'Accès non autorisé pour ce rôle' 
      });
    }
    
    next();
  };
};

// Middleware spécifique pour les administrateurs
const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'Accès non autorisé, token manquant' 
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      
      // Vérifier si l'utilisateur existe et est administrateur
      const user = await User.findByPk(decoded.id);
      
      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: 'Utilisateur non trouvé' 
        });
      }
      
      if (user.role !== 'admin') {
        return res.status(403).json({ 
          success: false,
          message: 'Accès réservé aux administrateurs' 
        });
      }
      
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ 
        success: false,
        message: 'Token invalide ou expiré' 
      });
    }
  } catch (error) {
    return res.status(500).json({ 
      success: false,
      message: 'Erreur serveur lors de l\'authentification' 
    });
  }
};

// Fonction pour générer un token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// Export des fonctions pour compatibilité avec les tests existants
exports.auth = verifyToken;
exports.adminAuth = adminAuth;

// Export des fonctions avec les noms utilisés dans le reste de l'application
exports.verifyToken = verifyToken;
exports.checkRole = checkRole;
exports.generateToken = generateToken;
