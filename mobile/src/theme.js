import { DefaultTheme } from 'react-native-paper';
import { Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

// Adaptation des dimensions selon appareil
const getSizeConstants = () => {
  // Mobile First: définir d'abord les valeurs pour mobile
  const base = {
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    fontSize: {
      caption: 12,
      body: 14,
      title: 18,
      heading: 22,
      largeHeading: 26,
    },
    borderRadius: {
      small: 4,
      medium: 8,
      large: 16,
    },
  };

  // Adapter seulement si nécessaire pour desktop/tablet
  if (width > 768 && Platform.OS === 'web') {
    return {
      ...base,
      spacing: {
        ...base.spacing,
        lg: 32,
        xl: 48,
      },
      fontSize: {
        ...base.fontSize,
        title: 20,
        heading: 26,
        largeHeading: 32,
      },
    };
  }

  return base;
};

// Couleurs identiques sur toutes les plateformes
const colors = {
  primary: '#14B8A6',
  accent: '#F59E0B',
  background: '#FFFFFF',
  surface: '#F9FAFB',
  text: '#1F2937',
  disabled: '#9CA3AF',
  placeholder: '#6B7280',
  backdrop: 'rgba(0, 0, 0, 0.5)',
  notification: '#EF4444',
  // Palette secondaire
  secondary: '#6366F1',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

// Obtenir les constantes de taille adaptées à l'appareil
const sizeConstants = getSizeConstants();

// Thème pour react-native-paper
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...colors,
  },
  // Rendre les constantes disponibles dans le thème
  spacing: sizeConstants.spacing,
  fontSize: sizeConstants.fontSize,
  borderRadius: sizeConstants.borderRadius,
  // Adaptation mobile/desktop des composants
  isDesktop: width > 1024 && Platform.OS === 'web',
  isTablet: width > 768 && width <= 1024 && Platform.OS === 'web',
  isMobile: width <= 768 || Platform.OS !== 'web',
};

export default theme;
