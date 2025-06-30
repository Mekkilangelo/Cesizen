require('dotenv').config();
const { Sequelize } = require('sequelize');

// Si on est en CI, on force la config MySQL attendue par le workflow
const isCI = process.env.CI === 'true';

const sequelize = isCI
  ? new Sequelize('Cesizen', 'root', '', {
      host: '127.0.0.1',
      dialect: 'mysql',
      port: 3306,
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    })
  : new Sequelize(
      process.env.DB_NAME || 'app_database',
      process.env.DB_USER || 'root',
      process.env.DB_PASSWORD || '',
      {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        port: process.env.DB_PORT || 3306,
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      }
    );

module.exports = sequelize;
