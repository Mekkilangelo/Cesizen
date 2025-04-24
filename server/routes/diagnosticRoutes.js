const express = require('express');
const router = express.Router();
const diagnosticController = require('../controller/diagnosticController');
const { verifyToken, optionalAuth, isAdmin } = require('../middleware/auth');

// Routes publiques - accessibles aux utilisateurs non connectés
router.get('/types', optionalAuth, diagnosticController.getDiagnosticTypes);
router.get('/public/:id', optionalAuth, diagnosticController.getPublicDiagnostic);

// Corriger l'ordre des routes - la route spécifique doit venir avant les routes génériques avec paramètres
router.get('/user', verifyToken, diagnosticController.getUserDiagnostics);

// Routes pour exécuter un diagnostic - accessibles avec authentification optionnelle
router.post('/execute', optionalAuth, diagnosticController.executeDiagnostic);
router.get('/:id/questions', optionalAuth, diagnosticController.getDiagnosticQuestions);

// Route pour obtenir un diagnostic spécifique
router.get('/:id', verifyToken, diagnosticController.getDiagnostic);

// Routes qui nécessitent une authentification
router.post('/', verifyToken, diagnosticController.saveDiagnosticResult);
router.delete('/:id', verifyToken, diagnosticController.deleteDiagnosticResult);

// Routes d'administration
router.get('/admin/all', verifyToken, isAdmin, diagnosticController.getAllDiagnostics);
router.post('/admin/create-type', verifyToken, isAdmin, diagnosticController.createDiagnosticType);
router.put('/admin/moderate/:id', verifyToken, isAdmin, diagnosticController.moderateDiagnostic);

module.exports = router;
