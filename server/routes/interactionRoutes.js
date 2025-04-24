const express = require('express');
const router = express.Router();
const interactionController = require('../controller/interactionController');
const { verifyToken, optionalAuth } = require('../middleware/auth');

// Routes pour les statistiques - accessibles à tous
router.get('/content/:contentId/stats', optionalAuth, interactionController.getContentInteractionStats);
router.get('/comment/:commentId/stats', optionalAuth, interactionController.getCommentInteractionStats);
router.get('/diagnostic/:diagnosticId/stats', optionalAuth, interactionController.getDiagnosticInteractionStats);

// Routes pour les interactions utilisateur - nécessitent une authentification
router.post('/content', verifyToken, interactionController.handleContentInteraction);
router.post('/comment', verifyToken, interactionController.handleCommentInteraction);
router.post('/diagnostic', verifyToken, interactionController.handleDiagnosticInteraction);
router.get('/content/:contentId/user', verifyToken, interactionController.getUserContentInteractions);
router.get('/diagnostic/:diagnosticId/user', verifyToken, interactionController.getUserDiagnosticInteractions);

module.exports = router;
