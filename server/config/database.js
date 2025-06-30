require('dotenv').config();
const { Sequelize } = require('sequelize');

//verif
// Toujours utiliser les variables d'environnement si présentes, sinon fallback explicite
const dbHost = process.env.DB_HOST || 'localhost';
const dbPassword = process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '';
const dbName = process.env.DB_NAME || 'Cesizen';
const dbUser = process.env.DB_USER || 'root';
const dbPort = process.env.DB_PORT || 3306;

const sequelize = new Sequelize(
  dbName,
  dbUser,
  dbPassword,
  {
    host: dbHost,
    dialect: 'mysql',
    port: dbPort,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

console.log('Sequelize config utilisée :', sequelize.config);
console.log('DB_HOST:', dbHost);
console.log('DB_USER:', dbUser);
console.log('DB_PASSWORD:', dbPassword);
console.log('DB_NAME:', dbName);
console.log('DB_PORT:', dbPort);

module.exports = sequelize;
