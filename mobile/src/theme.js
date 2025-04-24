import { DefaultTheme } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4CAF50', // Vert principal
    primaryLight: '#81C784', // Vert plus clair
    primaryDark: '#388E3C', // Vert plus foncé
    secondary: '#FFC107', // Jaune accentué
    secondaryLight: '#FFD54F', // Jaune plus clair
    accent: '#FFEB3B', // Jaune vif pour les accents
    background: '#F9FBF7', // Blanc légèrement verdâtre
    surface: '#FFFFFF', // Blanc pur
    text: '#2E3D2D', // Texte vert foncé pour un bon contraste
    textSecondary: '#5D6D5C', // Texte secondaire, vert moins foncé
    error: '#E53935', // Rouge pour les erreurs
    success: '#43A047', // Vert pour les succès
    warning: '#FFB300', // Jaune pour les avertissements
    info: '#039BE5', // Bleu pour les informations
    placeholder: '#9E9E9E', // Gris pour les placeholders
    disabled: '#E0E0E0', // Gris clair pour les éléments désactivés
    notification: '#FF9800', // Orange pour les notifications
    divider: '#ECEFEA', // Couleur légère pour les séparateurs
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    small: 4,
    medium: 8,
    large: 12,
    xl: 20,
    circle: 100,
  },
  fontSize: {
    caption: 12,
    small: 13,
    body: 14,
    subtitle: 16,
    title: 18,
    heading: 22,
    large: 26,
  },
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    bold: '700',
  },
  elevation: {
    small: 2,
    medium: 4,
    large: 8,
  }
};

export default theme;
