const express = require('express');
const router = express.Router();
const diagnosticController = require('../controller/diagnosticController');
const { verifyToken, checkRole } = require('../middleware/auth');

// Routes protégées (nécessitent un token JWT valide)
router.post('/', verifyToken, diagnosticController.createDiagnostic);
router.get('/user', verifyToken, diagnosticController.getUserDiagnostics);
router.get('/favorites', verifyToken, diagnosticController.getFavoriteDiagnostics);
router.get('/public', diagnosticController.getPublicDiagnostics);
router.get('/:id', verifyToken, diagnosticController.getDiagnostic);
router.put('/:id', verifyToken, diagnosticController.updateDiagnostic);
router.delete('/:id', verifyToken, diagnosticController.deleteDiagnostic);

module.exports = router;
