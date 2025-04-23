import { useState, useEffect } from 'react';
import { Dimensions, Platform } from 'react-native';

export const DEVICE_TYPES = {
  MOBILE: 'mobile',
  TABLET: 'tablet',
  DESKTOP: 'desktop'
};

// Hook pour obtenir et réagir aux changements de dimensions
export default function useResponsive() {
  const [windowDimensions, setWindowDimensions] = useState(
    Dimensions.get('window')
  );
  
  // Détecter les changements de taille d'écran
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setWindowDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  // Mobile first: commencer par assumer que c'est un mobile
  const { width, height } = windowDimensions;
  
  const deviceType = Platform.OS !== 'web' 
    ? DEVICE_TYPES.MOBILE
    : width < 768 
      ? DEVICE_TYPES.MOBILE 
      : width < 1024 
        ? DEVICE_TYPES.TABLET 
        : DEVICE_TYPES.DESKTOP;

  // Retourner toutes les infos utiles pour le responsive design
  return {
    width,
    height,
    deviceType,
    isMobile: deviceType === DEVICE_TYPES.MOBILE || Platform.OS !== 'web',
    isTablet: deviceType === DEVICE_TYPES.TABLET,
    isDesktop: deviceType === DEVICE_TYPES.DESKTOP,
    orientation: width > height ? 'landscape' : 'portrait',
  };
}
