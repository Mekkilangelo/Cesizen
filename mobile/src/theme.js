import { DefaultTheme } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3B82F6',
    accent: '#06B6D4',
    background: '#F9FAFB',
    surface: '#FFFFFF',
    text: '#1F2937',
    error: '#EF4444',
    placeholder: '#9CA3AF',
    notification: '#FF4081',
    disabled: '#E5E7EB',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    small: 4,
    medium: 8,
    large: 12,
  },
  fontSize: {
    caption: 12,
    body: 14,
    subtitle: 16,
    title: 18,
    heading: 22,
  }
};

export default theme;
