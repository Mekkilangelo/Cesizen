const { ContentInteraction, CommentInteraction, DiagnosticInteraction, Content, Comment, Diagnostic, User } = require('../models');
const { Op } = require('sequelize');

// Gestion des interactions avec les contenus
exports.handleContentInteraction = async (req, res) => {
  try {
    const { contentId, type } = req.body;
    const userId = req.user.id;

    if (!contentId || !type) {
      return res.status(400).json({
        success: false,
        message: 'Les paramètres contentId et type sont requis'
      });
    }

    // Vérifier que le contenu existe
    const content = await Content.findByPk(contentId);
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contenu non trouvé'
      });
    }

    // Vérifier si l'interaction existe déjà
    let interaction = await ContentInteraction.findOne({
      where: {
        userId,
        contentId,
        type
      }
    });

    // Si l'interaction existe déjà, la supprimer (toggle)
    if (interaction) {
      await interaction.destroy();
      return res.status(200).json({
        success: true,
        message: `${type} retiré avec succès`,
        status: 'removed'
      });
    }

    // Pour like/dislike, supprimer l'interaction opposée si elle existe
    if (type === 'like' || type === 'dislike') {
      const oppositeType = type === 'like' ? 'dislike' : 'like';
      await ContentInteraction.destroy({
        where: {
          userId,
          contentId,
          type: oppositeType
        }
      });
    }

    // Créer la nouvelle interaction
    interaction = await ContentInteraction.create({
      userId,
      contentId,
      type
    });

    return res.status(201).json({
      success: true,
      message: `${type} ajouté avec succès`,
      status: 'added'
    });
  } catch (error) {
    console.error('Erreur lors de la gestion de l\'interaction:', error);
    return res.status(500).json({
      success: false,
      message: `Erreur: ${error.message}`
    });
  }
};

// Obtenir les statistiques d'interactions pour un contenu
exports.getContentInteractionStats = async (req, res) => {
  try {
    const { contentId } = req.params;

    // Vérifier que le contenu existe
    const content = await Content.findByPk(contentId);
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contenu non trouvé'
      });
    }

    // Compter les différents types d'interactions
    const stats = {
      likes: await ContentInteraction.count({ where: { contentId, type: 'like' } }),
      dislikes: await ContentInteraction.count({ where: { contentId, type: 'dislike' } }),
      favorites: await ContentInteraction.count({ where: { contentId, type: 'favorite' } }),
      views: await ContentInteraction.count({ where: { contentId, type: 'view' } })
    };

    return res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return res.status(500).json({
      success: false,
      message: `Erreur: ${error.message}`
    });
  }
};

// Obtenir les interactions de l'utilisateur pour un contenu
exports.getUserContentInteractions = async (req, res) => {
  try {
    const { contentId } = req.params;
    const userId = req.user.id;

    // Vérifier que le contenu existe
    const content = await Content.findByPk(contentId);
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contenu non trouvé'
      });
    }

    // Récupérer toutes les interactions de l'utilisateur pour ce contenu
    const interactions = await ContentInteraction.findAll({
      where: {
        userId,
        contentId
      }
    });

    // Formatter les interactions pour le frontend
    const userInteractions = {
      like: interactions.some(interaction => interaction.type === 'like'),
      dislike: interactions.some(interaction => interaction.type === 'dislike'),
      favorite: interactions.some(interaction => interaction.type === 'favorite'),
      viewed: interactions.some(interaction => interaction.type === 'view')
    };

    return res.status(200).json({
      success: true,
      userInteractions
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des interactions utilisateur:', error);
    return res.status(500).json({
      success: false,
      message: `Erreur: ${error.message}`
    });
  }
};

// Gestion des interactions avec les commentaires
exports.handleCommentInteraction = async (req, res) => {
  try {
    const { commentId, type } = req.body;
    const userId = req.user.id;

    if (!commentId || !type) {
      return res.status(400).json({
        success: false,
        message: 'Les paramètres commentId et type sont requis'
      });
    }

    // Vérifier que le commentaire existe
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Commentaire non trouvé'
      });
    }

    // Vérifier si l'interaction existe déjà
    let interaction = await CommentInteraction.findOne({
      where: {
        userId,
        commentId,
        type
      }
    });

    // Si l'interaction existe déjà, la supprimer (toggle)
    if (interaction) {
      await interaction.destroy();
      return res.status(200).json({
        success: true,
        message: `${type} retiré avec succès`,
        status: 'removed'
      });
    }

    // Pour like/dislike, supprimer l'interaction opposée si elle existe
    if (type === 'like' || type === 'dislike') {
      const oppositeType = type === 'like' ? 'dislike' : 'like';
      await CommentInteraction.destroy({
        where: {
          userId,
          commentId,
          type: oppositeType
        }
      });
    }

    // Créer la nouvelle interaction
    interaction = await CommentInteraction.create({
      userId,
      commentId,
      type
    });

    return res.status(201).json({
      success: true,
      message: `${type} ajouté avec succès`,
      status: 'added'
    });
  } catch (error) {
    console.error('Erreur lors de la gestion de l\'interaction:', error);
    return res.status(500).json({
      success: false,
      message: `Erreur: ${error.message}`
    });
  }
};

// Gestion des interactions avec les diagnostics
exports.handleDiagnosticInteraction = async (req, res) => {
  try {
    const { diagnosticId, type } = req.body;
    const userId = req.user.id;

    // Vérifier que le diagnostic existe
    const diagnostic = await Diagnostic.findByPk(diagnosticId);
    if (!diagnostic) {
      return res.status(404).json({ success: false, message: 'Diagnostic non trouvé' });
    }

    // Vérifier si l'interaction existe déjà
    const existingInteraction = await DiagnosticInteraction.findOne({
      where: { userId, diagnosticId, type }
    });

    if (existingInteraction) {
      // Si l'interaction existe, on la supprime (toggle)
      await existingInteraction.destroy();
      return res.status(200).json({ 
        success: true, 
        message: `${type} retiré`, 
        status: false 
      });
    } else {
      // Si l'interaction n'existe pas, on la crée
      await DiagnosticInteraction.create({ userId, diagnosticId, type });
      
      // Pour les types dislike/like, s'assurer qu'il n'y a pas l'opposé
      if (type === 'like') {
        await DiagnosticInteraction.destroy({
          where: { userId, diagnosticId, type: 'dislike' }
        });
      } else if (type === 'dislike') {
        await DiagnosticInteraction.destroy({
          where: { userId, diagnosticId, type: 'like' }
        });
      }
      
      return res.status(201).json({ 
        success: true, 
        message: `${type} ajouté`, 
        status: true 
      });
    }
  } catch (error) {
    console.error(`Erreur lors de la gestion de l'interaction: ${error}`);
    return res.status(500).json({
      success: false,
      message: `Erreur lors de la gestion de l'interaction: ${error.message}`
    });
  }
};

// Récupérer les statistiques d'interaction pour un commentaire
exports.getCommentInteractionStats = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user ? req.user.id : null;

    // Vérifier que le commentaire existe
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Commentaire non trouvé' });
    }

    // Récupérer les statistiques d'interactions
    const likesCount = await CommentInteraction.count({ 
      where: { commentId, type: 'like' } 
    });
    
    const dislikesCount = await CommentInteraction.count({ 
      where: { commentId, type: 'dislike' } 
    });
    
    // Si l'utilisateur est authentifié, récupérer ses interactions
    let userInteractions = {};
    if (userId) {
      const interactions = await CommentInteraction.findAll({
        where: { userId, commentId }
      });
      
      interactions.forEach(interaction => {
        userInteractions[interaction.type] = true;
      });
    }

    return res.status(200).json({
      success: true,
      stats: {
        likes: likesCount,
        dislikes: dislikesCount
      },
      userInteractions
    });
  } catch (error) {
    console.error(`Erreur lors de la récupération des statistiques: ${error}`);
    return res.status(500).json({
      success: false,
      message: `Erreur lors de la récupération des statistiques: ${error.message}`
    });
  }
};

// Récupérer les statistiques d'interaction pour un diagnostic
exports.getDiagnosticInteractionStats = async (req, res) => {
  try {
    const { diagnosticId } = req.params;
    const userId = req.user ? req.user.id : null;

    // Vérifier que le diagnostic existe
    const diagnostic = await Diagnostic.findByPk(diagnosticId);
    if (!diagnostic) {
      return res.status(404).json({ success: false, message: 'Diagnostic non trouvé' });
    }

    // Récupérer les statistiques d'interactions
    const likesCount = await DiagnosticInteraction.count({ 
      where: { diagnosticId, type: 'like' } 
    });
    
    const dislikesCount = await DiagnosticInteraction.count({ 
      where: { diagnosticId, type: 'dislike' } 
    });
    
    const viewsCount = await DiagnosticInteraction.count({ 
      where: { diagnosticId, type: 'view' } 
    });
    
    const favoritesCount = await DiagnosticInteraction.count({ 
      where: { diagnosticId, type: 'favorite' } 
    });
    
    // Si l'utilisateur est authentifié, récupérer ses interactions
    let userInteractions = {};
    if (userId) {
      const interactions = await DiagnosticInteraction.findAll({
        where: { userId, diagnosticId }
      });
      
      interactions.forEach(interaction => {
        userInteractions[interaction.type] = true;
      });
    }

    return res.status(200).json({
      success: true,
      stats: {
        likes: likesCount,
        dislikes: dislikesCount,
        views: viewsCount,
        favorites: favoritesCount
      },
      userInteractions
    });
  } catch (error) {
    console.error(`Erreur lors de la récupération des statistiques: ${error}`);
    return res.status(500).json({
      success: false,
      message: `Erreur lors de la récupération des statistiques: ${error.message}`
    });
  }
};

// Récupérer les interactions d'un utilisateur pour un diagnostic spécifique
exports.getUserDiagnosticInteractions = async (req, res) => {
  try {
    const { diagnosticId } = req.params;
    const userId = req.user.id;

    // Vérifier que le diagnostic existe
    const diagnostic = await Diagnostic.findByPk(diagnosticId);
    if (!diagnostic) {
      return res.status(404).json({ success: false, message: 'Diagnostic non trouvé' });
    }

    // Récupérer les interactions de l'utilisateur
    const interactions = await DiagnosticInteraction.findAll({
      where: { userId, diagnosticId }
    });
    
    // Transformer les interactions en objet plus facile à utiliser
    const userInteractions = {};
    interactions.forEach(interaction => {
      userInteractions[interaction.type] = true;
    });

    return res.status(200).json({
      success: true,
      userInteractions
    });
  } catch (error) {
    console.error(`Erreur lors de la récupération des interactions utilisateur: ${error}`);
    return res.status(500).json({
      success: false,
      message: `Erreur lors de la récupération des interactions utilisateur: ${error.message}`
    });
  }
};
