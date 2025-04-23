const { Comment, User, Diagnostic } = require('../models');
const { Op } = require('sequelize');

// Contrôleur pour créer un nouveau commentaire
exports.createComment = async (req, res) => {
  try {
    const { diagnosticId, content, text, relatedContent } = req.body;
    const userId = req.user.id;

    // Vérifier si le diagnostic existe et est accessible
    const diagnostic = await Diagnostic.findOne({
      where: {
        id: diagnosticId,
        [Op.or]: [
          { userId },
          { isPublic: true }
        ]
      }
    });

    if (!diagnostic) {
      return res.status(404).json({
        message: 'Diagnostic non trouvé ou accès non autorisé'
      });
    }

    // S'assurer qu'on a le contenu du commentaire
    // Accepter soit 'content' soit 'text' comme champ pour le contenu
    const commentContent = content || text || relatedContent;
    
    if (!commentContent) {
      return res.status(400).json({
        message: 'Le contenu du commentaire est obligatoire'
      });
    }

    // Créer le commentaire
    const comment = await Comment.create({
      userId,
      diagnosticId,
      content: commentContent,
      relatedContent,
      isModerated: false
    });

    // Récupérer le commentaire avec les informations de l'utilisateur
    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        }
      ]
    });

    return res.status(201).json({
      message: 'Commentaire ajouté avec succès',
      comment: commentWithUser
    });
  } catch (error) {
    console.error('Erreur lors de la création du commentaire:', error);
    return res.status(500).json({
      message: 'Erreur serveur lors de la création du commentaire'
    });
  }
};

// Contrôleur pour récupérer les commentaires d'un diagnostic
exports.getDiagnosticComments = async (req, res) => {
  try {
    const { diagnosticId } = req.params;
    const userId = req.user.id;

    // Vérifier si le diagnostic existe et est accessible
    const diagnostic = await Diagnostic.findOne({
      where: {
        id: diagnosticId,
        [Op.or]: [
          { userId },
          { isPublic: true }
        ]
      }
    });

    if (!diagnostic) {
      return res.status(404).json({
        message: 'Diagnostic non trouvé ou accès non autorisé'
      });
    }

    // Récupérer les commentaires
    const comments = await Comment.findAll({
      where: { 
        diagnosticId,
        [Op.or]: [
          { isModerated: false },
          { moderatedBy: { [Op.not]: null } }
        ]
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({ comments });
  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires:', error);
    return res.status(500).json({
      message: 'Erreur serveur lors de la récupération des commentaires'
    });
  }
};

// Contrôleur pour mettre à jour un commentaire
exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { relatedContent } = req.body;
    const userId = req.user.id;

    // Vérifier si le commentaire existe et appartient à l'utilisateur
    const comment = await Comment.findOne({
      where: { id, userId }
    });

    if (!comment) {
      return res.status(404).json({
        message: 'Commentaire non trouvé ou accès non autorisé'
      });
    }

    // Mettre à jour le commentaire
    await comment.update({ 
      relatedContent,
      isModerated: false // Réinitialiser le statut de modération après modification
    });

    return res.status(200).json({
      message: 'Commentaire mis à jour avec succès',
      comment
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du commentaire:', error);
    return res.status(500).json({
      message: 'Erreur serveur lors de la mise à jour du commentaire'
    });
  }
};

// Contrôleur pour supprimer un commentaire
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Vérifier si le commentaire existe
    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({
        message: 'Commentaire non trouvé'
      });
    }

    // Vérifier si l'utilisateur est autorisé à supprimer le commentaire
    if (comment.userId !== userId && !['admin', 'moderator'].includes(userRole)) {
      return res.status(403).json({
        message: 'Accès non autorisé pour supprimer ce commentaire'
      });
    }

    // Supprimer le commentaire
    await comment.destroy();

    return res.status(200).json({
      message: 'Commentaire supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du commentaire:', error);
    return res.status(500).json({
      message: 'Erreur serveur lors de la suppression du commentaire'
    });
  }
};

// Contrôleur pour modérer un commentaire (réservé aux modérateurs et administrateurs)
exports.moderateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'approve' ou 'reject'
    const moderatorId = req.user.id;

    // Vérifier si le commentaire existe
    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({
        message: 'Commentaire non trouvé'
      });
    }

    if (action === 'approve') {
      // Approuver le commentaire
      await comment.update({
        isModerated: true,
        moderatedBy: moderatorId
      });

      return res.status(200).json({
        message: 'Commentaire approuvé avec succès',
        comment
      });
    } else if (action === 'reject') {
      // Rejeter le commentaire (suppression)
      await comment.destroy();

      return res.status(200).json({
        message: 'Commentaire rejeté et supprimé avec succès'
      });
    } else {
      return res.status(400).json({
        message: 'Action de modération non valide'
      });
    }
  } catch (error) {
    console.error('Erreur lors de la modération du commentaire:', error);
    return res.status(500).json({
      message: 'Erreur serveur lors de la modération du commentaire'
    });
  }
};
