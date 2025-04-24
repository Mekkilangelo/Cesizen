const { Comment, User, Content } = require('../models');

// Création d'un nouveau commentaire
exports.createComment = async (req, res) => {
  try {
    const { contentId, text, content } = req.body;
    const userId = req.user.id;
    
    // Utilisez content ou text, selon ce qui est disponible
    const commentContent = content || text;
    
    if (!commentContent) {
      return res.status(400).json({
        success: false,
        message: 'Le contenu du commentaire est requis'
      });
    }
    
    // Vérifier que le contenu existe
    const contentExists = await Content.findByPk(contentId);
    if (!contentExists) {
      return res.status(404).json({ 
        success: false, 
        message: 'Contenu non trouvé' 
      });
    }
    
    // Créer le commentaire
    const newComment = await Comment.create({
      userId,
      contentId,
      content: commentContent  // Utilisez la variable adaptée
    });
    
    // Récupérer les infos de l'utilisateur pour la réponse
    const commentWithUser = await Comment.findByPk(newComment.id, {
      include: [{ model: User, attributes: ['id', 'username'] }]
    });
    
    return res.status(201).json({
      success: true,
      comment: commentWithUser
    });
  } catch (error) {
    console.error('Erreur lors de la création du commentaire:', error);
    return res.status(500).json({
      success: false,
      message: `Erreur lors de la création du commentaire: ${error.message}`
    });
  }
};

// Récupération des commentaires d'un contenu
exports.getContentComments = async (req, res) => {
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
    
    // Récupérer les commentaires avec les infos utilisateur
    const comments = await Comment.findAll({
      where: { contentId },
      include: [{ model: User, attributes: ['id', 'username'] }],
      order: [['createdAt', 'DESC']]
    });
    
    return res.status(200).json({
      success: true,
      comments
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires:', error);
    return res.status(500).json({
      success: false,
      message: `Erreur lors de la récupération des commentaires: ${error.message}`
    });
  }
};

// Mise à jour d'un commentaire
exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user.id;
    
    // Récupérer le commentaire
    const comment = await Comment.findByPk(id);
    
    // Vérifier l'existence du commentaire
    if (!comment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Commentaire non trouvé' 
      });
    }
    
    // Vérifier que l'utilisateur est propriétaire du commentaire
    if (comment.userId !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Vous n\'avez pas les droits pour modifier ce commentaire' 
      });
    }
    
    // Mettre à jour le commentaire
    comment.text = text;
    await comment.save();
    
    return res.status(200).json({
      success: true,
      comment
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du commentaire:', error);
    return res.status(500).json({
      success: false,
      message: `Erreur lors de la mise à jour du commentaire: ${error.message}`
    });
  }
};

// Suppression d'un commentaire
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Récupérer le commentaire
    const comment = await Comment.findByPk(id);
    
    // Vérifier l'existence du commentaire
    if (!comment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Commentaire non trouvé' 
      });
    }
    
    // Vérifier que l'utilisateur est propriétaire du commentaire
    if (comment.userId !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Vous n\'avez pas les droits pour supprimer ce commentaire' 
      });
    }
    
    // Supprimer le commentaire
    await comment.destroy();
    
    return res.status(200).json({
      success: true,
      message: 'Commentaire supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du commentaire:', error);
    return res.status(500).json({
      success: false,
      message: `Erreur lors de la suppression du commentaire: ${error.message}`
    });
  }
};

// Récupération des commentaires d'un diagnostic
exports.getDiagnosticComments = async (req, res) => {
  try {
    const { diagnosticId } = req.params;
    
    // Vérifier que le diagnostic existe
    const diagnostic = await Diagnostic.findByPk(diagnosticId);
    if (!diagnostic) {
      return res.status(404).json({ 
        success: false, 
        message: 'Diagnostic non trouvé' 
      });
    }
    
    // Récupérer les commentaires avec les infos utilisateur
    const comments = await Comment.findAll({
      where: { diagnosticId },
      include: [{ model: User, attributes: ['id', 'username'] }],
      order: [['createdAt', 'DESC']]
    });
    
    return res.status(200).json({
      success: true,
      comments
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires du diagnostic:', error);
    return res.status(500).json({
      success: false,
      message: `Erreur lors de la récupération des commentaires: ${error.message}`
    });
  }
};
