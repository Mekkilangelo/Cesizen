const express = require('express');
const router = express.Router();
const contentController = require('../controller/contentController');
const { verifyToken, optionalAuth, isAdmin } = require('../middleware/auth');

// Routes publiques accessibles sans authentification ou avec authentification optionnelle
router.get('/', optionalAuth, contentController.getPublicContents);
router.get('/public', optionalAuth, contentController.getPublicContents);

// Routes protégées (nécessitent une authentification)
router.post('/', verifyToken, contentController.createContent);

// Important: Placer les routes spécifiques avant les routes paramétrées
router.get('/user', verifyToken, contentController.getUserContents);
router.get('/user/me', verifyToken, contentController.getUserContents);
router.get('/user/favorites', verifyToken, contentController.getFavoriteContents);

// Routes d'administration
router.get('/admin/all', verifyToken, isAdmin, contentController.getAllContents);
router.put('/admin/moderate/:id', verifyToken, isAdmin, contentController.moderateContent);

// Routes paramétrées - TOUJOURS mettre ces routes APRÈS les routes spécifiques
router.get('/:id', optionalAuth, contentController.getContent);
router.put('/:id', verifyToken, contentController.updateContent);
router.delete('/:id', verifyToken, contentController.deleteContent);

module.exports = router;
