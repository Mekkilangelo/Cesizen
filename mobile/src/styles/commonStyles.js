import { StyleSheet } from 'react-native';
import theme from '../theme';

export const commonStyles = StyleSheet.create({
  // Ombres pour différents niveaux d'élévation
  shadowSmall: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: theme.elevation.small,
  },
  shadowMedium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 2.5,
    elevation: theme.elevation.medium,
  },
  shadowLarge: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: theme.elevation.large,
  },
  
  // Cartes et conteneurs
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  cardElevated: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: theme.elevation.medium,
  },
  
  // Boutons stylés
  fabButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.circle,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: theme.spacing.xl,
    right: theme.spacing.xl,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  
  // Gradients pour les en-têtes
  headerGradient: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  
  // Containers communs
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centeredContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
  },
  
  // Espacement section
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.title,
    fontWeight: theme.fontWeight.medium,
    marginBottom: theme.spacing.sm,
    color: theme.colors.text,
  },
  
  // Séparateurs
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: theme.colors.divider,
    marginVertical: theme.spacing.md,
  },
  
  // Styles pour les formulaires
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    fontSize: theme.fontSize.small,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  
  // Badges et étiquettes
  badge: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.small,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: theme.fontSize.caption,
    color: theme.colors.surface,
    fontWeight: theme.fontWeight.medium,
  },
  
  // Animations de chargement
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
});

export default commonStyles;