const { Diagnostic, User, Question, DiagnosticInteraction } = require('../models');
const { Op } = require('sequelize');

// Contrôleur pour créer un nouveau diagnostic
exports.createDiagnostic = async (req, res) => {
  try {
    const { title, responses, isPublic } = req.body;
    const userId = req.user.id;

    // Calculer le score en fonction des réponses
    const score = await calculateScore(responses);

    // Générer des recommandations basées sur le score
    const recommendations = generateRecommendations(score);

    // Créer le diagnostic
    const diagnostic = await Diagnostic.create({
      userId,
      title,
      score,
      responses,
      recommendations,
      isPublic: isPublic || false,
      completedAt: new Date()
    });

    return res.status(201).json({
      message: 'Diagnostic créé avec succès',
      diagnostic
    });
  } catch (error) {
    console.error('Erreur lors de la création du diagnostic:', error);
    return res.status(500).json({
      message: 'Erreur serveur lors de la création du diagnostic'
    });
  }
};

// Contrôleur pour récupérer tous les diagnostics d'un utilisateur
exports.getUserDiagnostics = async (req, res) => {
  try {
    const userId = req.user.id;

    const diagnostics = await Diagnostic.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({ diagnostics });
  } catch (error) {
    console.error('Erreur lors de la récupération des diagnostics:', error);
    return res.status(500).json({
      message: 'Erreur serveur lors de la récupération des diagnostics'
    });
  }
};

// Contrôleur pour récupérer un diagnostic spécifique
exports.getDiagnostic = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const diagnostic = await Diagnostic.findOne({
      where: {
        id,
        [Op.or]: [
          { userId },
          { isPublic: true }
        ]
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        }
      ]
    });

    if (!diagnostic) {
      return res.status(404).json({
        message: 'Diagnostic non trouvé ou accès non autorisé'
      });
    }

    // Enregistrer une vue
    const existingView = await DiagnosticInteraction.findOne({
      where: { userId, diagnosticId: id, type: 'view' }
    });
    
    if (!existingView) {
      await DiagnosticInteraction.create({
        userId,
        diagnosticId: id,
        type: 'view'
      });
    }
    
    // Récupérer les statistiques d'interactions
    const stats = {
      likes: await DiagnosticInteraction.count({ where: { diagnosticId: id, type: 'like' } }),
      dislikes: await DiagnosticInteraction.count({ where: { diagnosticId: id, type: 'dislike' } }),
      views: await DiagnosticInteraction.count({ where: { diagnosticId: id, type: 'view' } }),
      favorites: await DiagnosticInteraction.count({ where: { diagnosticId: id, type: 'favorite' } })
    };
    
    // Récupérer les interactions de l'utilisateur
    const userInteractions = {};
    const interactions = await DiagnosticInteraction.findAll({
      where: { userId, diagnosticId: id }
    });
    
    interactions.forEach(interaction => {
      userInteractions[interaction.type] = true;
    });

    return res.status(200).json({ 
      diagnostic,
      stats,
      userInteractions
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du diagnostic:', error);
    return res.status(500).json({
      message: 'Erreur serveur lors de la récupération du diagnostic'
    });
  }
};

// Contrôleur pour mettre à jour un diagnostic
exports.updateDiagnostic = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, isPublic } = req.body;
    const userId = req.user.id;

    // Vérifier si le diagnostic existe et appartient à l'utilisateur
    const diagnostic = await Diagnostic.findOne({
      where: { id, userId }
    });

    if (!diagnostic) {
      return res.status(404).json({
        message: 'Diagnostic non trouvé ou accès non autorisé'
      });
    }

    // Mettre à jour le diagnostic
    await diagnostic.update({ title, isPublic });

    return res.status(200).json({
      message: 'Diagnostic mis à jour avec succès',
      diagnostic
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du diagnostic:', error);
    return res.status(500).json({
      message: 'Erreur serveur lors de la mise à jour du diagnostic'
    });
  }
};

// Contrôleur pour supprimer un diagnostic
exports.deleteDiagnostic = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Vérifier si le diagnostic existe et appartient à l'utilisateur
    const diagnostic = await Diagnostic.findOne({
      where: { id, userId }
    });

    if (!diagnostic) {
      return res.status(404).json({
        message: 'Diagnostic non trouvé ou accès non autorisé'
      });
    }

    // Supprimer le diagnostic
    await diagnostic.destroy();

    return res.status(200).json({
      message: 'Diagnostic supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du diagnostic:', error);
    return res.status(500).json({
      message: 'Erreur serveur lors de la suppression du diagnostic'
    });
  }
};

// Contrôleur pour récupérer les diagnostics publics
exports.getPublicDiagnostics = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const diagnostics = await Diagnostic.findAndCountAll({
      where: { isPublic: true },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return res.status(200).json({
      diagnostics: diagnostics.rows,
      totalPages: Math.ceil(diagnostics.count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des diagnostics publics:', error);
    return res.status(500).json({
      message: 'Erreur serveur lors de la récupération des diagnostics publics'
    });
  }
};

// Ajouter une méthode pour récupérer les diagnostics favoris de l'utilisateur
exports.getFavoriteDiagnostics = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const userId = req.user.id;

    // Récupérer tous les IDs de diagnostics favoris
    const favorites = await DiagnosticInteraction.findAll({
      where: { userId, type: 'favorite' },
      attributes: ['diagnosticId']
    });
    
    const favoriteIds = favorites.map(fav => fav.diagnosticId);
    
    if (favoriteIds.length === 0) {
      return res.status(200).json({
        diagnostics: [],
        totalPages: 0,
        currentPage: parseInt(page)
      });
    }
    
    const { count, rows: diagnostics } = await Diagnostic.findAndCountAll({
      where: { id: { [Op.in]: favoriteIds } },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return res.status(200).json({
      diagnostics,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des diagnostics favoris:', error);
    return res.status(500).json({
      message: 'Erreur serveur lors de la récupération des diagnostics favoris'
    });
  }
};

// Fonction utilitaire pour calculer le score en fonction des réponses
const calculateScore = async (responses) => {
  try {
    // Récupérer toutes les questions pour obtenir leurs poids
    const questions = await Question.findAll({
      where: {
        id: {
          [Op.in]: Object.keys(responses)
        }
      }
    });

    // Calculer le score total
    let totalScore = 0;
    let maxPossibleScore = 0;

    questions.forEach(question => {
      const response = responses[question.id];
      const weight = question.weight || 1;
      
      // Logique de calcul du score en fonction du type de question
      if (question.type === 'scale') {
        // Pour les questions à échelle, utiliser la valeur directement
        totalScore += (response * weight);
        maxPossibleScore += (10 * weight); // Supposons une échelle de 1 à 10
      } else if (question.type === 'multiple_choice' || question.type === 'single_choice') {
        // Pour les questions à choix, chaque option a une valeur
        const options = question.options || [];
        const selectedOption = options.find(opt => opt.value === response);
        
        if (selectedOption && selectedOption.score) {
          totalScore += (selectedOption.score * weight);
          
          // Trouver le score maximum possible pour cette question
          const maxOptionScore = Math.max(...options.map(opt => opt.score || 0));
          maxPossibleScore += (maxOptionScore * weight);
        }
      }
    });

    // Normaliser le score sur 100
    return Math.round((totalScore / maxPossibleScore) * 100) || 0;
  } catch (error) {
    console.error('Erreur lors du calcul du score:', error);
    return 0;
  }
};

// Fonction utilitaire pour générer des recommandations basées sur le score
const generateRecommendations = (score) => {
  if (score >= 80) {
    return "Excellent résultat ! Votre situation est très bonne. Continuez ainsi et envisagez d'optimiser davantage certains aspects.";
  } else if (score >= 60) {
    return "Bon résultat. Votre situation est satisfaisante, mais il y a quelques points à améliorer pour atteindre l'excellence.";
  } else if (score >= 40) {
    return "Résultat moyen. Plusieurs aspects nécessitent votre attention. Concentrez-vous sur les domaines les plus faibles identifiés dans le diagnostic.";
  } else if (score >= 20) {
    return "Résultat préoccupant. De nombreux aspects nécessitent des améliorations significatives. Nous vous recommandons d'établir un plan d'action prioritaire.";
  } else {
    return "Résultat critique. Une refonte complète de votre approche est nécessaire. Contactez un expert pour vous aider à établir un plan de redressement.";
  }
};
