const { User } = require('../models');
const { generateToken } = require('../middleware/auth');
const { Op } = require('sequelize');

// Contrôleur pour l'inscription d'un nouvel utilisateur
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérifier si l'email ou le nom d'utilisateur existe déjà
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Cet email ou nom d\'utilisateur est déjà utilisé'
      });
    }

    // Créer le nouvel utilisateur
    const newUser = await User.create({
      username,
      email,
      password,
      role: 'user'
    });

    // Générer un token JWT
    const token = generateToken(newUser);

    // Retourner les informations de l'utilisateur sans le mot de passe
    const userWithoutPassword = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role
    };

    return res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return res.status(500).json({
      message: 'Erreur serveur lors de l\'inscription'
    });
  }
};

// Contrôleur pour la connexion d'un utilisateur
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur par email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier si l'utilisateur est actif
    if (!user.isActive) {
      return res.status(401).json({
        message: 'Ce compte a été désactivé'
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.checkPassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Mettre à jour la date de dernière connexion
    await user.update({ lastLogin: new Date() });

    // Générer un token JWT
    const token = generateToken(user);

    // Retourner les informations de l'utilisateur sans le mot de passe
    const userWithoutPassword = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    return res.status(200).json({
      message: 'Connexion réussie',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return res.status(500).json({
      message: 'Erreur serveur lors de la connexion'
    });
  }
};

// Contrôleur pour récupérer le profil de l'utilisateur connecté
exports.getProfile = async (req, res) => {
  try {
    // L'utilisateur est déjà disponible dans req.user grâce au middleware d'authentification
    const user = req.user;

    // Retourner les informations de l'utilisateur sans le mot de passe
    const userWithoutPassword = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      lastLogin: user.lastLogin
    };

    return res.status(200).json({
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    return res.status(500).json({
      message: 'Erreur serveur lors de la récupération du profil'
    });
  }
};

// Contrôleur pour mettre à jour le profil de l'utilisateur
exports.updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const userId = req.user.id;

    // Vérifier si l'email ou le nom d'utilisateur existe déjà pour un autre utilisateur
    if (username || email) {
      const existingUser = await User.findOne({
        where: {
          [Op.and]: [
            { [Op.or]: [
              ...(username ? [{ username }] : []),
              ...(email ? [{ email }] : [])
            ] },
            { id: { [Op.ne]: userId } }
          ]
        }
      });

      if (existingUser) {
        return res.status(400).json({
          message: 'Cet email ou nom d\'utilisateur est déjà utilisé'
        });
      }
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await User.update(
      { username, email },
      { where: { id: userId }, returning: true }
    );

    return res.status(200).json({
      message: 'Profil mis à jour avec succès',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    return res.status(500).json({
      message: 'Erreur serveur lors de la mise à jour du profil'
    });
  }
};

// Contrôleur pour changer le mot de passe
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Récupérer l'utilisateur
    const user = await User.findByPk(userId);

    // Vérifier le mot de passe actuel
    const isPasswordValid = await user.checkPassword(currentPassword);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Mot de passe actuel incorrect'
      });
    }

    // Mettre à jour le mot de passe
    await user.update({ password: newPassword });

    return res.status(200).json({
      message: 'Mot de passe changé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    return res.status(500).json({
      message: 'Erreur serveur lors du changement de mot de passe'
    });
  }
};
