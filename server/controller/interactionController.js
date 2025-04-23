const { ContentInteraction, CommentInteraction, DiagnosticInteraction, Content, Comment, Diagnostic } = require('../models');

// Gestion des interactions avec les contenus
exports.handleContentInteraction = async (req, res) => {
  try {
    const { contentId, type } = req.body;
    const userId = req.user.id;

    // Vérifier que le content existe
    const content = await Content.findByPk(contentId);
    if (!content) {
      return res.status(404).json({ success: false, message: 'Contenu non trouvé' });
    }

    // Vérifier si l'interaction existe déjà
    const existingInteraction = await ContentInteraction.findOne({
      where: { userId, contentId, type }
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
      await ContentInteraction.create({ userId, contentId, type });
      
      // Pour les types dislike/like, s'assurer qu'il n'y a pas l'opposé
      if (type === 'like') {
        await ContentInteraction.destroy({
          where: { userId, contentId, type: 'dislike' }
        });
      } else if (type === 'dislike') {
        await ContentInteraction.destroy({
          where: { userId, contentId, type: 'like' }
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

// Gestion des interactions avec les commentaires
exports.handleCommentInteraction = async (req, res) => {
  try {
    const { commentId, type } = req.body;
    const userId = req.user.id;

    // Vérifier que le commentaire existe
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Commentaire non trouvé' });
    }

    // Vérifier si l'interaction existe déjà
    const existingInteraction = await CommentInteraction.findOne({
      where: { userId, commentId, type }
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
      await CommentInteraction.create({ userId, commentId, type });
      
      // Pour les types dislike/like, s'assurer qu'il n'y a pas l'opposé
      if (type === 'like') {
        await CommentInteraction.destroy({
          where: { userId, commentId, type: 'dislike' }
        });
      } else if (type === 'dislike') {
        await CommentInteraction.destroy({
          where: { userId, commentId, type: 'like' }
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

// Récupérer les statistiques d'interaction pour un contenu
exports.getContentInteractionStats = async (req, res) => {
  try {
    const { contentId } = req.params;
    const userId = req.user ? req.user.id : null;

    // Vérifier que le contenu existe
    const content = await Content.findByPk(contentId);
    if (!content) {
      return res.status(404).json({ success: false, message: 'Contenu non trouvé' });
    }

    // Récupérer les statistiques d'interactions
    const likesCount = await ContentInteraction.count({ 
      where: { contentId, type: 'like' } 
    });
    
    const dislikesCount = await ContentInteraction.count({ 
      where: { contentId, type: 'dislike' } 
    });
    
    const viewsCount = await ContentInteraction.count({ 
      where: { contentId, type: 'view' } 
    });
    
    const favoritesCount = await ContentInteraction.count({ 
      where: { contentId, type: 'favorite' } 
    });
    
    // Si l'utilisateur est authentifié, récupérer ses interactions
    let userInteractions = {};
    if (userId) {
      const interactions = await ContentInteraction.findAll({
        where: { userId, contentId }
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
