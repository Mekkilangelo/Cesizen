const express = require('express');
const router = express.Router();
const commentController = require('../controller/commentController');
const { verifyToken, checkRole } = require('../middleware/auth');

// Routes protégées (nécessitent un token JWT valide)
router.post('/', verifyToken, commentController.createComment);

// Seulement les routes qui ont des fonctions implémentées
router.get('/content/:contentId', commentController.getContentComments);

// Supprimez ou commentez ces lignes jusqu'à ce que les fonctions soient implémentées
// router.get('/diagnostic/:diagnosticId', verifyToken, commentController.getDiagnosticComments);
// router.put('/:id', verifyToken, commentController.updateComment);
// router.delete('/:id', verifyToken, commentController.deleteComment);

module.exports = router;
