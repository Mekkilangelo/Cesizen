// Charger les variables d'environnement du .env, mais ne pas écraser celles déjà définies (ex: CI)
require('dotenv').config({ override: false });
const sequelize = require('../config/database');

// Configuration pour une base de données de test
process.env.NODE_ENV = 'test';

// Debug : afficher les variables d'environnement utilisées pour la DB
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);

// Augmenter le timeout pour les opérations de base de données
jest.setTimeout(10000);

// Avant tous les tests, connecter à la base de données
beforeAll(async () => {
  await sequelize.authenticate();
});

// Après tous les tests, fermer la connexion
afterAll(async () => {
  await sequelize.close();
});
