import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

const CategoryBadge = ({ label, type, size = 'medium', style }) => {
  const theme = useTheme();
  
  // Définir différentes couleurs selon le type de contenu
  const getTypeColor = () => {
    switch (type) {
      case 'article':
        return { bg: theme.colors.primary, text: theme.colors.surface };
      case 'resource':
        return { bg: theme.colors.secondary, text: theme.colors.text };
      case 'tutorial':
        return { bg: theme.colors.primaryDark, text: theme.colors.surface };
      default:
        return { bg: theme.colors.primaryLight, text: theme.colors.surface };
    }
  };
  
  // Définir différentes tailles
  const getSize = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: theme.spacing.xs / 2,
          paddingHorizontal: theme.spacing.sm,
          fontSize: theme.fontSize.caption,
        };
      case 'large':
        return {
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.md,
          fontSize: theme.fontSize.body,
        };
      default: // medium
        return {
          paddingVertical: theme.spacing.xs,
          paddingHorizontal: theme.spacing.sm,
          fontSize: theme.fontSize.small,
        };
    }
  };
  
  const typeColor = getTypeColor();
  const sizeStyle = getSize();
  
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: typeColor.bg,
          paddingVertical: sizeStyle.paddingVertical,
          paddingHorizontal: sizeStyle.paddingHorizontal,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: typeColor.text,
            fontSize: sizeStyle.fontSize,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 50,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '500',
  },
});

export default CategoryBadge;