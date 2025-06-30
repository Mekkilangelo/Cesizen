require('dotenv').config();
const { Sequelize } = require('sequelize');

const host = process.env.DB_HOST || (process.env.CI ? '127.0.0.1' : 'localhost');
const sequelize = new Sequelize(
  process.env.DB_NAME || 'app_database',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host,
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
