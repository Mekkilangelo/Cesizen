const sequelize = require('../config/database');
const User = require('./User');
const Diagnostic = require('./Diagnostic');
const Comment = require('./Comment');
const Question = require('./Question');
const Content = require('./Content');
const ContentInteraction = require('./ContentInteraction');
const CommentInteraction = require('./CommentInteraction');
const DiagnosticInteraction = require('./DiagnosticInteraction');

// Définition des associations entre les modèles
User.hasMany(Diagnostic, { foreignKey: 'userId', as: 'diagnostics' });
Diagnostic.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Associations pour les contenus
User.hasMany(Content, { foreignKey: 'userId', as: 'contents' });
Content.belongsTo(User, { foreignKey: 'userId', as: 'author' });

// Associations pour les commentaires
Content.hasMany(Comment, { foreignKey: 'contentId', as: 'comments', onDelete: 'CASCADE' });
Comment.belongsTo(Content, { foreignKey: 'contentId', as: 'relatedContent' });

Diagnostic.hasMany(Comment, { foreignKey: 'diagnosticId', as: 'comments', onDelete: 'CASCADE' });
Comment.belongsTo(Diagnostic, { foreignKey: 'diagnosticId', as: 'diagnostic' });

// Association pour la modération des commentaires
User.hasMany(Comment, { foreignKey: 'moderatedBy', as: 'moderatedComments' });
Comment.belongsTo(User, { foreignKey: 'moderatedBy', as: 'moderator' });

// Associations pour les interactions avec les contenus
User.hasMany(ContentInteraction, { foreignKey: 'userId' });
ContentInteraction.belongsTo(User, { foreignKey: 'userId' });
Content.hasMany(ContentInteraction, { foreignKey: 'contentId', as: 'interactions' });
ContentInteraction.belongsTo(Content, { foreignKey: 'contentId' });

// Associations pour les interactions avec les commentaires
User.hasMany(CommentInteraction, { foreignKey: 'userId' });
CommentInteraction.belongsTo(User, { foreignKey: 'userId' });
Comment.hasMany(CommentInteraction, { foreignKey: 'commentId', as: 'interactions' });
CommentInteraction.belongsTo(Comment, { foreignKey: 'commentId' });

// Associations pour les interactions avec les diagnostics
User.hasMany(DiagnosticInteraction, { foreignKey: 'userId' });
DiagnosticInteraction.belongsTo(User, { foreignKey: 'userId' });
Diagnostic.hasMany(DiagnosticInteraction, { foreignKey: 'diagnosticId', as: 'interactions', onDelete: 'CASCADE' });
DiagnosticInteraction.belongsTo(Diagnostic, { foreignKey: 'diagnosticId' });

module.exports = {
  User,
  Diagnostic,
  Comment,
  Question,
  Content,
  ContentInteraction,
  CommentInteraction,
  DiagnosticInteraction,
  sequelize
};
