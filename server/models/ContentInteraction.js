const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ContentInteraction = sequelize.define('ContentInteraction', {
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
  contentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Contents',
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
  indexes: [
    {
      unique: true,
      fields: ['userId', 'contentId', 'type']
    }
  ]
});

module.exports = ContentInteraction;
