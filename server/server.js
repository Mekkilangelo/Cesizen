const http = require('http');
const app = require('./app');
const sequelize = require('./config/database');

// Définir le port
const PORT = process.env.PORT || 5001; // Update to use 5001 as the default port

// Créer le serveur HTTP
const server = http.createServer(app);

// Fonction pour synchroniser la base de données et démarrer le serveur
const startServer = async () => {
  try {
    // Synchroniser la base de données
    console.log('Connexion à la base de données...');
    await sequelize.authenticate();
    console.log('Connexion à la base de données établie avec succès.');
    
    // Synchroniser les modèles avec la base de données
    // Utiliser { force: true } temporairement pour recréer les tables
    // ATTENTION: Cela supprimera toutes les données existantes
    // Après le premier démarrage réussi, remplacez par { alter: true }
    await sequelize.sync({ force: true });  // À changer en { alter: true } après le premier démarrage
    console.log('Modèles synchronisés avec la base de données.');
    
    // Démarrer le serveur
    server.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
    });
  } catch (error) {
    console.error('Impossible de se connecter à la base de données:', error);
    process.exit(1);
  }
};

// Démarrer le serveur
startServer();

// Gestion des erreurs non capturées
process.on('unhandledRejection', (err) => {
  console.error('Erreur non gérée:', err);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = server;
