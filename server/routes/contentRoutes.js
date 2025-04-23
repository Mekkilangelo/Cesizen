const express = require('express');
const router = express.Router();
const contentController = require('../controller/contentController');
const { verifyToken } = require('../middleware/auth');

// Routes publiques
router.get('/public', contentController.getPublicContents);
router.get('/:id', contentController.getContent);

// Routes protégées (nécessitent une authentification)
router.post('/', verifyToken, contentController.createContent);
router.get('/user/me', verifyToken, contentController.getUserContents);
router.put('/:id', verifyToken, contentController.updateContent);
router.delete('/:id', verifyToken, contentController.deleteContent);

// Route pour les favoris
router.get('/user/favorites', verifyToken, contentController.getFavoriteContents);

module.exports = router;
