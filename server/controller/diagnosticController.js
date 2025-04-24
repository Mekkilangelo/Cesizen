const { Diagnostic, User, Question, DiagnosticInteraction } = require('../models');
const { Op } = require('sequelize');

// Déterminer le niveau de risque en fonction du score
const getRiskLevel = (score) => {
  if (score < 150) return 'low';
  if (score < 300) return 'moderate';
  return 'high';
};

// Générer des recommandations basées sur le score
const generateRecommendations = (score, isHolmesRahe = false) => {
  if (isHolmesRahe) {
    if (score >= 300) {
      return "Risque élevé de stress (80% de risque de problèmes de santé liés au stress). Il est fortement recommandé de consulter un professionnel de santé et de mettre en place des stratégies de gestion du stress, comme la méditation, l'exercice régulier et la réduction des engagements non essentiels.";
    } else if (score >= 150) {
      return "Risque modéré de stress (50% de risque de problèmes de santé liés au stress). Envisagez d'intégrer des techniques de relaxation dans votre routine quotidienne, d'améliorer votre sommeil et de partager vos préoccupations avec des personnes de confiance.";
    } else {
      return "Faible risque de stress. Continuez à prendre soin de votre bien-être et à maintenir un équilibre entre vie professionnelle et personnelle. La pratique régulière d'activités qui vous plaisent contribuera à maintenir ce faible niveau de stress.";
    }
  } else {
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
  }
};

// Contrôleur pour créer un nouveau diagnostic
exports.createDiagnostic = async (req, res) => {
  try {
    const { title, responses, isPublic, rawScore, isHolmesRahe = false } = req.body;
    const userId = req.user.id;

    let score;
    if (isHolmesRahe && rawScore !== undefined) {
      score = rawScore;
    } else {
      score = await calculateScore(responses);
    }

    const riskLevel = getRiskLevel(score);
    const recommendations = generateRecommendations(score, isHolmesRahe);

    const diagnostic = await Diagnostic.create({
      userId,
      title,
      score,
      responses,
      riskLevel,
      recommendations,
      isPublic: isPublic || false,
      completedAt: new Date(),
      diagnosticType: isHolmesRahe ? 'holmes-rahe' : 'general'
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
    
    const stats = {
      likes: await DiagnosticInteraction.count({ where: { diagnosticId: id, type: 'like' } }),
      dislikes: await DiagnosticInteraction.count({ where: { diagnosticId: id, type: 'dislike' } }),
      views: await DiagnosticInteraction.count({ where: { diagnosticId: id, type: 'view' } }),
      favorites: await DiagnosticInteraction.count({ where: { diagnosticId: id, type: 'favorite' } })
    };
    
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

    const diagnostic = await Diagnostic.findOne({
      where: { id, userId }
    });

    if (!diagnostic) {
      return res.status(404).json({
        message: 'Diagnostic non trouvé ou accès non autorisé'
      });
    }

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
    
    console.log(`Tentative de suppression du diagnostic ID: ${id} (type: ${typeof id}) par utilisateur ID: ${userId}`);

    // 1. Vérifier si le diagnostic existe et appartient à l'utilisateur
    const diagnostic = await Diagnostic.findOne({
      where: { id, userId }
    });

    if (!diagnostic) {
      console.log(`Diagnostic non trouvé ou accès non autorisé. ID: ${id}, userID: ${userId}`);
      return res.status(404).json({
        success: false,
        message: 'Diagnostic non trouvé ou accès non autorisé'
      });
    }

    // 2. Supprimer d'abord toutes les interactions associées à ce diagnostic
    console.log(`Suppression des interactions liées au diagnostic ID: ${id}`);
    await DiagnosticInteraction.destroy({
      where: { diagnosticId: id }
    });

    // 3. Ensuite, supprimer le diagnostic lui-même
    console.log(`Suppression du diagnostic ID: ${id}`);
    await diagnostic.destroy();
    
    console.log(`Diagnostic ID: ${id} supprimé avec succès`);

    return res.status(200).json({
      success: true,
      message: 'Diagnostic supprimé avec succès',
      id
    });
  } catch (error) {
    console.error('Erreur détaillée lors de la suppression du diagnostic:', error);
    
    // Journalisation spécifique pour les erreurs de contrainte
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      console.error('Erreur de contrainte de clé étrangère. Des enregistrements liés existent.');
    }
    
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression du diagnostic: ' + error.message,
      error: error.name
    });
  }
};

// Aligner deleteDiagnosticResult sur deleteDiagnostic pour éviter la confusion
exports.deleteDiagnosticResult = exports.deleteDiagnostic;

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

// Contrôleur pour récupérer les types de diagnostic disponibles
exports.getDiagnosticTypes = async (req, res) => {
  try {
    const diagnosticTypes = [
      { id: 'general', name: 'Diagnostic Général', description: 'Évaluation générale de votre situation' },
      { id: 'holmes-rahe', name: 'Holmes-Rahe', description: 'Évaluation du niveau de stress basée sur les événements de vie' },
    ];

    return res.status(200).json({
      success: true,
      types: diagnosticTypes
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des types de diagnostic:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des types de diagnostic'
    });
  }
};

// Contrôleur pour récupérer un diagnostic public
exports.getPublicDiagnostic = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user.id : null;

    const diagnostic = await Diagnostic.findOne({
      where: {
        id,
        isPublic: true
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
        success: false,
        message: 'Diagnostic public non trouvé'
      });
    }

    if (userId) {
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
    }
    
    const stats = {
      likes: await DiagnosticInteraction.count({ where: { diagnosticId: id, type: 'like' } }),
      dislikes: await DiagnosticInteraction.count({ where: { diagnosticId: id, type: 'dislike' } }),
      views: await DiagnosticInteraction.count({ where: { diagnosticId: id, type: 'view' } }),
      favorites: await DiagnosticInteraction.count({ where: { diagnosticId: id, type: 'favorite' } })
    };
    
    let userInteractions = {};
    if (userId) {
      const interactions = await DiagnosticInteraction.findAll({
        where: { userId, diagnosticId: id }
      });
      
      interactions.forEach(interaction => {
        userInteractions[interaction.type] = true;
      });
    }

    return res.status(200).json({
      success: true,
      diagnostic,
      stats,
      userInteractions
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du diagnostic public:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération du diagnostic public'
    });
  }
};

// Contrôleur pour exécuter un diagnostic
exports.executeDiagnostic = async (req, res) => {
  try {
    const { responses, diagnosticType = 'general' } = req.body;
    const userId = req.user ? req.user.id : null;

    let score;
    if (diagnosticType === 'holmes-rahe') {
      score = Object.values(responses).reduce((total, value) => total + parseInt(value || 0), 0);
    } else {
      score = await calculateScore(responses);
    }

    const riskLevel = getRiskLevel(score);
    const recommendations = generateRecommendations(score, diagnosticType === 'holmes-rahe');

    const result = {
      score,
      riskLevel,
      recommendations,
      responses,
      diagnosticType
    };

    if (userId) {
      result.userId = userId;
      result.canSave = true;
    } else {
      result.canSave = false;
    }

    return res.status(200).json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Erreur lors de l\'exécution du diagnostic:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'exécution du diagnostic'
    });
  }
};

// Contrôleur pour récupérer les questions d'un diagnostic
exports.getDiagnosticQuestions = async (req, res) => {
  try {
    const { id } = req.params;

    const questions = await Question.findAll({
      where: { diagnosticType: id },
      order: [['order', 'ASC']]
    });

    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Aucune question trouvée pour le diagnostic de type ${id}`
      });
    }

    return res.status(200).json({
      success: true,
      questions
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des questions:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des questions'
    });
  }
};

// Contrôleur pour sauvegarder un résultat de diagnostic
exports.saveDiagnosticResult = async (req, res) => {
  try {
    const { title, responses, isPublic, rawScore, diagnosticType, isHolmesRahe } = req.body;
    const userId = req.user.id;

    console.log('Données reçues pour la création du diagnostic:', req.body);

    // S'assurer que le score est correctement défini
    let score = rawScore;

    // Calculer le niveau de risque basé sur le score
    let riskLevel;
    if (score < 150) {
      riskLevel = 'low';
    } else if (score < 300) {
      riskLevel = 'moderate';
    } else {
      riskLevel = 'high';
    }

    // Générer des recommandations
    const recommendations = generateRecommendations(score, isHolmesRahe);

    // Créer le diagnostic avec toutes les données requises
    const diagnostic = await Diagnostic.create({
      userId,
      title: title || `Diagnostic ${diagnosticType || 'holmes-rahe'} - ${new Date().toLocaleString()}`,
      score, // Assurez-vous que score est défini
      riskLevel, // Assurez-vous que riskLevel est défini
      responses,
      recommendations,
      isPublic: isPublic || false,
      completedAt: new Date(),
      diagnosticType: diagnosticType || 'holmes-rahe'
    });

    // Log pour le débogage
    console.log('Diagnostic créé avec succès:', diagnostic.id);

    return res.status(201).json({
      success: true,
      message: 'Résultat de diagnostic enregistré avec succès',
      diagnostic
    });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du résultat:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'enregistrement du résultat: ' + error.message
    });
  }
};

// Contrôleur pour récupérer tous les diagnostics (admin)
exports.getAllDiagnostics = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = {};
    if (status) {
      whereClause.status = status;
    }
    
    const { count, rows: diagnostics } = await Diagnostic.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email']
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
      diagnostics
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des diagnostics:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des diagnostics'
    });
  }
};

// Contrôleur pour créer un nouveau type de diagnostic
exports.createDiagnosticType = async (req, res) => {
  try {
    const { name, description, questions } = req.body;
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé: Seuls les administrateurs peuvent créer des types de diagnostic'
      });
    }
    
    return res.status(201).json({
      success: true,
      message: 'Type de diagnostic créé avec succès',
      diagnosticType: {
        name,
        description,
        questions: questions ? questions.length : 0
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création du type de diagnostic:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du type de diagnostic'
    });
  }
};

// Contrôleur pour modérer un diagnostic
exports.moderateDiagnostic = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, moderationComment } = req.body;
    const adminId = req.user.id;
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé: Seuls les administrateurs peuvent modérer les diagnostics'
      });
    }
    
    const diagnostic = await Diagnostic.findByPk(id);
    
    if (!diagnostic) {
      return res.status(404).json({
        success: false,
        message: 'Diagnostic non trouvé'
      });
    }
    
    await diagnostic.update({
      status,
      moderatedBy: adminId,
      moderationComment,
      moderationDate: new Date()
    });
    
    return res.status(200).json({
      success: true,
      message: `Le diagnostic a été modéré avec succès (statut: ${status})`,
      diagnostic
    });
  } catch (error) {
    console.error('Erreur lors de la modération du diagnostic:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la modération du diagnostic'
    });
  }
};

const calculateScore = async (responses) => {
  try {
    const questions = await Question.findAll({
      where: {
        id: {
          [Op.in]: Object.keys(responses)
        }
      }
    });

    let totalScore = 0;
    let maxPossibleScore = 0;

    questions.forEach(question => {
      const response = responses[question.id];
      const weight = question.weight || 1;
      
      if (question.type === 'scale') {
        totalScore += (response * weight);
        maxPossibleScore += (10 * weight);
      } else if (question.type === 'multiple_choice' || question.type === 'single_choice') {
        const options = question.options || [];
        const selectedOption = options.find(opt => opt.value === response);
        
        if (selectedOption && selectedOption.score) {
          totalScore += (selectedOption.score * weight);
          
          const maxOptionScore = Math.max(...options.map(opt => opt.score || 0));
          maxPossibleScore += (maxOptionScore * weight);
        }
      }
    });

    return Math.round((totalScore / maxPossibleScore) * 100) || 0;
  } catch (error) {
    console.error('Erreur lors du calcul du score:', error);
    return 0;
  }
};
