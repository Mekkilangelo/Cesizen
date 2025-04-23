const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CommentInteraction = sequelize.define('CommentInteraction', {
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
  commentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Comments',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('like', 'dislike', 'favorite', 'report'),
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
      fields: ['userId', 'commentId', 'type']
    }
  ]
});

module.exports = CommentInteraction;
