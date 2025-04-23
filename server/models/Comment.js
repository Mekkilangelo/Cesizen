const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comment = sequelize.define('Comment', {
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
    allowNull: true, // Modification: passer à true pour permettre ON DELETE SET NULL
    references: {
      model: 'Diagnostics',
      key: 'id'
    }
  },
  contentId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Déjà true, c'est bon
    references: {
      model: 'Contents',
      key: 'id'
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  isModerated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  moderatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  validate: {
    eitherDiagnosticOrContent() {
      if (!this.diagnosticId && !this.contentId) {
        throw new Error('Un commentaire doit être associé soit à un diagnostic, soit à un contenu');
      }
      if (this.diagnosticId && this.contentId) {
        throw new Error('Un commentaire ne peut pas être associé à la fois à un diagnostic et à un contenu');
      }
    }
  }
});

module.exports = Comment;
