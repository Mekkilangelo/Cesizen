const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Fonction pour générer un token JWT
exports.generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email, role: user.role || 'user' },
    process.env.JWT_SECRET || 'votre_clé_secrète',
    { expiresIn: '24h' }
  );
};

// Middleware pour vérifier le token JWT
exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé: Token manquant'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'votre_clé_secrète');
    
    // Trouver l'utilisateur correspondant
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé: Utilisateur introuvable'
      });
    }
    
    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role || 'user' // Assurer qu'un rôle par défaut est attribué
    };
    
    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return res.status(401).json({
      success: false,
      message: 'Non autorisé: Token invalide'
    });
  }
};

// Middleware pour vérifier si l'utilisateur est un admin
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Accès interdit: Seuls les administrateurs peuvent effectuer cette action'
    });
  }
};

// Middleware optionnel pour permettre l'authentification sans l'exiger
exports.optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      // Pas de token, mais on continue quand même (utilisateur anonyme)
      req.user = null;
      return next();
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'votre_clé_secrète');
      
      // Trouver l'utilisateur correspondant
      const user = await User.findByPk(decoded.id);
      
      if (user) {
        req.user = {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role || 'user'
        };
      } else {
        req.user = null;
      }
    } catch (tokenError) {
      // Token invalide, mais on continue quand même (utilisateur anonyme)
      req.user = null;
    }
    
    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    req.user = null;
    next();
  }
};
