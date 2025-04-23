const sequelize = require('../config/database');

// Configuration pour une base de données de test
process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'cesizen_test';

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
