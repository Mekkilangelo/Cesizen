const express = require('express');
const router = express.Router();
const interactionController = require('../controller/interactionController');
const { verifyToken } = require('../middleware/auth');

// Routes pour les interactions avec les contenus
router.post('/content', verifyToken, interactionController.handleContentInteraction);
router.get('/content/:contentId/stats', interactionController.getContentInteractionStats);
router.get('/content/:contentId/user', verifyToken, interactionController.getUserContentInteractions);

// Routes pour les interactions avec les commentaires - si implémentées
router.post('/comment', verifyToken, interactionController.handleCommentInteraction);

module.exports = router;
