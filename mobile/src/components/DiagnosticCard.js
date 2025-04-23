import React from 'react';
import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { Card, Text, Badge, useTheme, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import useResponsive from '../hooks/useResponsive';

// Carte de diagnostic conçue spécifiquement pour mobile
const DiagnosticCard = ({ diagnostic, onShare, onFavorite }) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { isMobile } = useResponsive();
  
  const handlePress = () => {
    navigation.navigate('DiagnosticDetail', { 
      id: diagnostic.id,
      title: diagnostic.title
    });
  };

  // Style adaptatif basé sur la plateforme
  const styles = StyleSheet.create({
    card: {
      marginVertical: theme.spacing.sm,
      marginHorizontal: isMobile ? theme.spacing.sm : theme.spacing.lg,
      borderRadius: theme.borderRadius.medium,
      overflow: 'hidden',
    },
    content: {
      padding: theme.spacing.md,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    title: {
      fontSize: theme.fontSize.title,
      fontWeight: 'bold',
      flex: 1,
      color: theme.colors.text,
    },
    score: {
      backgroundColor: getScoreColor(diagnostic.score),
      borderRadius: 50,
      paddingVertical: 6,
      paddingHorizontal: 12,
      marginLeft: theme.spacing.sm,
    },
    scoreText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize: theme.fontSize.body,
    },
    date: {
      fontSize: theme.fontSize.caption,
      color: theme.colors.placeholder,
      marginBottom: theme.spacing.sm,
    },
    recommendations: {
      fontSize: theme.fontSize.body,
      color: theme.colors.text,
      marginVertical: theme.spacing.sm,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: '#F3F4F6',
    },
    actions: {
      flexDirection: 'row',
    },
    tag: {
      backgroundColor: '#E0F2F1',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      marginRight: 8,
    },
    tagText: {
      fontSize: 12,
      color: theme.colors.primary,
    },
    // Optimisation pour tactile sur mobile
    touchableArea: {
      padding: isMobile ? 8 : 0,
    },
  });

  // Fonction pour déterminer la couleur selon le score
  function getScoreColor(score) {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#14B8A6';
    if (score >= 40) return '#F59E0B';
    if (score >= 20) return '#F97316';
    return '#EF4444';
  }

  // Format de date adapté au mobile (plus compact)
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  return (
    <Card style={styles.card} onPress={handlePress}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {diagnostic.title}
          </Text>
          <View style={styles.score}>
            <Text style={styles.scoreText}>{diagnostic.score}%</Text>
          </View>
        </View>
        
        <Text style={styles.date}>
          {formatDate(diagnostic.completedAt)}
        </Text>
        
        {/* Sur mobile, on limite le texte pour économiser l'espace */}
        {diagnostic.recommendations && (
          <Text 
            style={styles.recommendations} 
            numberOfLines={isMobile ? 2 : 3}>
            {diagnostic.recommendations}
          </Text>
        )}
        
        <View style={styles.footer}>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>
                {diagnostic.isPublic ? 'Public' : 'Privé'}
              </Text>
            </View>
          </View>
          
          <View style={styles.actions}>
            {/* Boutons avec zones tactiles optimisées pour mobile */}
            <TouchableOpacity 
              style={styles.touchableArea}
              onPress={() => onFavorite(diagnostic.id)}
            >
              <IconButton
                icon={diagnostic.isFavorite ? "heart" : "heart-outline"}
                iconColor={diagnostic.isFavorite ? theme.colors.error : theme.colors.text}
                size={20}
              />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.touchableArea}
              onPress={() => onShare(diagnostic.id)}
            >
              <IconButton
                icon="share-variant"
                iconColor={theme.colors.text}
                size={20}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Card>
  );
};

export default DiagnosticCard;
