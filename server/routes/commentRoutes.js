const express = require('express');
const router = express.Router();
const commentController = require('../controller/commentController');
const { verifyToken, optionalAuth, isAdmin } = require('../middleware/auth');

// Routes pour la lecture des commentaires - accessibles à tous
router.get('/content/:contentId', optionalAuth, commentController.getContentComments);
router.get('/diagnostic/:diagnosticId', optionalAuth, commentController.getDiagnosticComments);

// Routes qui nécessitent une authentification
router.post('/', verifyToken, commentController.createComment);
router.put('/:id', verifyToken, commentController.updateComment);
router.delete('/:id', verifyToken, commentController.deleteComment);

// Routes d'administration
router.get('/admin/all', verifyToken, isAdmin, commentController.getAllComments);
router.put('/admin/moderate/:id', verifyToken, isAdmin, commentController.moderateComment);

module.exports = router;
