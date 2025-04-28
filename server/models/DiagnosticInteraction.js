const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DiagnosticInteraction = sequelize.define('DiagnosticInteraction', {
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
  diagnosticId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Diagnostics',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('like', 'dislike', 'favorite', 'report', 'share', 'view'),
    allowNull: false
  },
  interactionDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'DiagnosticInteractions', // Définir explicitement le nom de la table
  indexes: [
    {
      unique: true,
      fields: ['userId', 'diagnosticId', 'type'],
      name: 'diagnostic_interaction_unique'
    }
  ]
});

module.exports = DiagnosticInteraction;
