import { useSelector } from 'react-redux';

/**
 * Hook pour gérer les autorisations basées sur les rôles
 * Permet de vérifier si l'utilisateur actuel a la permission d'effectuer une action
 */
export const usePermissions = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const userRole = user?.role || 'anonymous';
  
  /**
   * Vérifie si l'utilisateur est connecté
   * @returns {boolean}
   */
  const isLoggedIn = () => {
    return isAuthenticated === true;
  };
  
  /**
   * Vérifie si l'utilisateur est un administrateur
   * @returns {boolean}
   */
  const isAdmin = () => {
    return isAuthenticated && userRole === 'admin';
  };
  
  /**
   * Vérifie si l'utilisateur est propriétaire de la ressource
   * @param {number|string} resourceUserId - ID de l'utilisateur propriétaire de la ressource
   * @returns {boolean}
   */
  const isOwner = (resourceUserId) => {
    return isAuthenticated && user?.id === resourceUserId;
  };
  
  /**
   * Vérifie si l'utilisateur peut effectuer une action sur une ressource
   * @param {string} action - L'action à effectuer (create, read, update, delete)
   * @param {string} resourceType - Le type de ressource (content, comment, diagnostic)
   * @param {object} resource - La ressource elle-même (optionnel)
   * @returns {boolean}
   */
  const canPerformAction = (action, resourceType, resource = null) => {
    // Si l'utilisateur n'est pas connecté
    if (!isAuthenticated) {
      // Les utilisateurs anonymes peuvent uniquement lire les ressources publiques
      return action === 'read' && (!resource || resource.isPublic !== false);
    }
    
    // Les administrateurs peuvent tout faire
    if (isAdmin()) {
      return true;
    }
    
    // Les utilisateurs connectés
    switch (action) {
      case 'create':
        // Peut créer des contenus, commentaires ou diagnostics
        return true;
      
      case 'read':
        // Peut lire toutes les ressources publiques et ses propres ressources privées
        return !resource || resource.isPublic || isOwner(resource.userId);
      
      case 'update':
      case 'delete':
        // Peut modifier ou supprimer uniquement ses propres ressources
        return resource && isOwner(resource.userId);
      
      case 'interact':
        // Peut interagir (like, dislike, etc.) avec n'importe quelle ressource publique
        return !resource || resource.isPublic || isOwner(resource.userId);
      
      default:
        return false;
    }
  };
  
  return {
    isLoggedIn,
    isAdmin,
    isOwner,
    canPerformAction,
    userRole,
  };
};

export default usePermissions;