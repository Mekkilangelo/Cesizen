express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

// Importer les routes
const authRoutes = require('./routes/authRoutes');
const diagnosticRoutes = require('./routes/diagnosticRoutes');
const commentRoutes = require('./routes/commentRoutes');
const contentRoutes = require('./routes/contentRoutes');
const interactionRoutes = require('./routes/interactionRoutes');

// Initialiser l'application Express
const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Middleware pour parser les données de formulaire
app.use(express.urlencoded({ extended: true }));

// Middleware CORS - configuration plus permissive pour le développement
app.use(cors({
  origin: '*',  // Autoriser toutes les origines en développement
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
}));

// Ajouter des logs supplémentaires pour le débogage
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.method === 'DELETE') {
    console.log('=== REQUÊTE DELETE REÇUE ===');
    console.log('URL:', req.url);
    console.log('Paramètres:', req.params);
    console.log('Headers:', req.headers);
  }
  next();
});

// Middleware pour servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Servir les fichiers statiques du front-end (React/Expo web build)
app.use(express.static(path.join(__dirname, 'public')));

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/diagnostics', diagnosticRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/contents', contentRoutes);
app.use('/api/interactions', interactionRoutes);

// Route de test pour vérifier que le serveur fonctionne (API only)
app.get('/api', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API de l\'application' });
});

// Route catch-all pour servir l'application front-end (SPA)
// Doit être après toutes les routes API
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Une erreur est survenue sur le serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

module.exports = app;
