const { Content, User, Comment, ContentInteraction } = require('../models');
const { Op } = require('sequelize');

// Vérifiez que la fonction createContent traite bien tous les champs
exports.createContent = async (req, res) => {
  try {
    const { title, body, type, tags, isPublic, status } = req.body;
    const userId = req.user.id; // Assuré par le middleware verifyToken
    
    // Création du contenu avec tous les champs
    const content = await Content.create({
      title,
      body,
      type,
      isPublic,
      status,
      userId
    });
    
    // Si des tags sont fournis, les ajouter
    if (tags && tags.length > 0) {
      // Votre logique pour gérer les tags
      // Selon votre modèle de données
    }
    
    return res.status(201).json({
      success: true,
      content
    });
  } catch (error) {
    console.error('Erreur création contenu:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Une erreur est survenue lors de la création du contenu'
    });
  }
};

// Récupérer tous les contenus publics
exports.getPublicContents = async (req, res) => {
  try {
    const { type, search, limit = 10, page = 1 } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = {
      isPublic: true,
      status: 'published'
    };
    
    if (type) {
      whereClause.type = type;
    }
    
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { body: { [Op.like]: `%${search}%` } }
      ];
    }
    
    const { count, rows: contents } = await Content.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    return res.status(200).json({
      success: true,
      count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      contents
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des contenus:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des contenus',
      error: error.message
    });
  }
};

// Récupérer les contenus d'un utilisateur
exports.getUserContents = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const offset = (page - 1) * limit;
    
    const { count, rows: contents } = await Content.findAndCountAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    return res.status(200).json({
      success: true,
      count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      contents
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des contenus:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des contenus',
      error: error.message
    });
  }
};

// Récupérer un contenu spécifique
exports.getContent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user.id : null;
    
    const content = await Content.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username']
        },
        {
          model: Comment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username']
            }
          ],
          where: { isModerated: true },
          required: false
        }
      ]
    });
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contenu non trouvé'
      });
    }
    
    // Vérifier si l'utilisateur a le droit de voir ce contenu
    if (!content.isPublic && content.userId !== (userId || 0) && req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'avez pas accès à ce contenu'
      });
    }
    
    // Enregistrer une vue si l'utilisateur est authentifié
    if (userId) {
      const existingView = await ContentInteraction.findOne({
        where: { userId, contentId: id, type: 'view' }
      });
      
      if (!existingView) {
        await ContentInteraction.create({
          userId,
          contentId: id,
          type: 'view'
        });
      }
    }
    
    // Récupérer les statistiques d'interactions
    const stats = {
      likes: await ContentInteraction.count({ where: { contentId: id, type: 'like' } }),
      dislikes: await ContentInteraction.count({ where: { contentId: id, type: 'dislike' } }),
      views: await ContentInteraction.count({ where: { contentId: id, type: 'view' } }),
      favorites: await ContentInteraction.count({ where: { contentId: id, type: 'favorite' } })
    };
    
    // Récupérer les interactions de l'utilisateur si authentifié
    let userInteractions = {};
    if (userId) {
      const interactions = await ContentInteraction.findAll({
        where: { userId, contentId: id }
      });
      
      interactions.forEach(interaction => {
        userInteractions[interaction.type] = true;
      });
    }
    
    return res.status(200).json({
      success: true,
      content,
      stats,
      userInteractions
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du contenu:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du contenu',
      error: error.message
    });
  }
};

// Mettre à jour un contenu
exports.updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, body, type, status, isPublic, tags, mediaUrl } = req.body;
    
    const content = await Content.findByPk(id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contenu non trouvé'
      });
    }
    
    // Vérifier si l'utilisateur a le droit de modifier ce contenu
    if (content.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'avez pas le droit de modifier ce contenu'
      });
    }
    
    await content.update({
      title: title || content.title,
      body: body || content.body,
      type: type || content.type,
      status: status || content.status,
      isPublic: isPublic !== undefined ? isPublic : content.isPublic,
      tags: tags || content.tags,
      mediaUrl: mediaUrl || content.mediaUrl
    });
    
    return res.status(200).json({
      success: true,
      content
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du contenu:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du contenu',
      error: error.message
    });
  }
};

// Supprimer un contenu
exports.deleteContent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const content = await Content.findByPk(id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contenu non trouvé'
      });
    }
    
    // Vérifier si l'utilisateur a le droit de supprimer ce contenu
    if (content.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'avez pas le droit de supprimer ce contenu'
      });
    }
    
    await content.destroy();
    
    return res.status(200).json({
      success: true,
      message: 'Contenu supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du contenu:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du contenu',
      error: error.message
    });
  }
};

// Récupérer les contenus favoris d'un utilisateur
exports.getFavoriteContents = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const offset = (page - 1) * limit;
    const userId = req.user.id;
    
    // Récupérer tous les IDs de contenus favoris
    const favorites = await ContentInteraction.findAll({
      where: { userId, type: 'favorite' },
      attributes: ['contentId']
    });
    
    const favoriteIds = favorites.map(fav => fav.contentId);
    
    if (favoriteIds.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        pages: 0,
        currentPage: parseInt(page),
        contents: []
      });
    }
    
    // Récupérer les contenus correspondants
    const { count, rows: contents } = await Content.findAndCountAll({
      where: { id: { [Op.in]: favoriteIds } },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });
    
    return res.status(200).json({
      success: true,
      count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      contents
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des favoris:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des favoris',
      error: error.message
    });
  }
};
