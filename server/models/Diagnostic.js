const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Diagnostic = sequelize.define('Diagnostic', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Score total sur l\'échelle Holmes-Rahe'
  },
  responses: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Stockage des événements sélectionnés (1 = sélectionné, 0 = non sélectionné)'
  },
  riskLevel: {
    type: DataTypes.ENUM('low', 'moderate', 'high'),
    allowNull: false,
    comment: 'Niveau de risque: faible (<150), modéré (150-299), élevé (>=300)'
  },
  recommendations: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  completedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = Diagnostic;
