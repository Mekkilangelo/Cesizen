const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('multiple_choice', 'single_choice', 'scale', 'text'),
    allowNull: false
  },
  options: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Options de réponse pour les questions à choix'
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  weight: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: 'Poids de la question dans le calcul du score'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Question;
