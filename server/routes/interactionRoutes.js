const express = require('express');
const router = express.Router();
const interactionController = require('../controller/interactionController');
const { verifyToken } = require('../middleware/auth');

// Routes pour les interactions avec les contenus
router.post('/content', verifyToken, interactionController.handleContentInteraction);
router.get('/content/:contentId/stats', interactionController.getContentInteractionStats);

// Routes pour les interactions avec les commentaires
router.post('/comment', verifyToken, interactionController.handleCommentInteraction);
router.get('/comment/:commentId/stats', interactionController.getCommentInteractionStats);

// Routes pour les interactions avec les diagnostics
router.post('/diagnostic', verifyToken, interactionController.handleDiagnosticInteraction);
router.get('/diagnostic/:diagnosticId/stats', interactionController.getDiagnosticInteractionStats);

module.exports = router;
