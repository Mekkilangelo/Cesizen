const express = require('express');
const router = express.Router();
const commentController = require('../controller/commentController');
const { verifyToken, checkRole } = require('../middleware/auth');

// Routes protégées (nécessitent un token JWT valide)
router.post('/', verifyToken, commentController.createComment);
router.get('/diagnostic/:diagnosticId', verifyToken, commentController.getDiagnosticComments);
router.put('/:id', verifyToken, commentController.updateComment);
router.delete('/:id', verifyToken, commentController.deleteComment);

// Routes réservées aux modérateurs et administrateurs
router.put('/:id/moderate', verifyToken, checkRole(['admin', 'moderator']), commentController.moderateComment);

module.exports = router;
