import { useWindowDimensions } from 'react-native';

/**
 * Hook pour gérer la réactivité de l'interface en fonction de la taille de l'écran
 */
const useResponsive = () => {
  const { width, height } = useWindowDimensions();
  
  // Définir les seuils pour les différentes tailles d'écran
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;
  
  // Calculer des espacements dynamiques basés sur la taille de l'écran
  const getSpacing = (baseMobile, baseTablet, baseDesktop) => {
    if (isMobile) return baseMobile;
    if (isTablet) return baseTablet || baseMobile * 1.5;
    return baseDesktop || baseMobile * 2;
  };
  
  return {
    width,
    height,
    isMobile,
    isTablet,
    isDesktop,
    getSpacing
  };
};

export default useResponsive;
