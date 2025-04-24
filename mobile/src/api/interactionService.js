import apiClient from './apiClient';

const interactionService = {
  // Ajouter/supprimer un like
  toggleLike: async (contentId) => {
    try {
      const response = await apiClient.post('/interactions/content', {
        contentId,
        type: 'like'
      });
      return response.data;
    } catch (error) {
      console.error('Erreur like:', error);
      throw error;
    }
  },

  // Ajouter/supprimer un dislike
  toggleDislike: async (contentId) => {
    try {
      const response = await apiClient.post('/interactions/content', {
        contentId,
        type: 'dislike'
      });
      return response.data;
    } catch (error) {
      console.error('Erreur dislike:', error);
      throw error;
    }
  },

  // Ajouter/supprimer un favori
  toggleFavorite: async (contentId) => {
    try {
      const response = await apiClient.post('/interactions/content', {
        contentId,
        type: 'favorite'
      });
      return response.data;
    } catch (error) {
      console.error('Erreur favori:', error);
      throw error;
    }
  },

  // Enregistrer une vue
  recordView: async (contentId) => {
    try {
      const response = await apiClient.post('/interactions/content', {
        contentId,
        type: 'view'
      });
      return response.data;
    } catch (error) {
      console.error('Erreur enregistrement vue:', error);
      throw error;
    }
  },

  // Ajouter un commentaire
  addComment: async (contentId, text) => {
    try {
      const response = await apiClient.post(`/comments`, {
        contentId,
        text
      });
      return response.data;
    } catch (error) {
      console.error('Erreur commentaire:', error);
      throw error;
    }
  }
};

export default interactionService;