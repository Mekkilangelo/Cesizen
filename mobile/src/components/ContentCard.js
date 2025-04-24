import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Chip, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { getContentStats } from '../store/contentSlice';
import useResponsive from '../hooks/useResponsive';
import DeleteContentButton from './DeleteContentButton';
import CategoryBadge from './CategoryBadge';
import UserAvatar from './UserAvatar';
import commonStyles from '../styles/commonStyles';

const ContentCard = ({ content, horizontal = false, onPress, showDeleteButton = false, isFavorite = false, isGuest = false }) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { isMobile } = useResponsive();
  const dispatch = useDispatch();
  
  // Récupérer les stats depuis le state Redux
  const contentStats = useSelector(state => state.contents.contentStats[content.id] || {});
  
  // Combiner les stats du contenu avec celles du Redux
  const stats = content.stats || contentStats || { 
    views: 0, 
    likes: 0, 
    dislikes: 0,
    favorites: 0,
    comments: 0
  };
  
  useEffect(() => {
    // Charger les statistiques au montage du composant
    dispatch(getContentStats(content.id));
  }, [dispatch, content.id]);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Navigation par défaut
      navigation.navigate(isGuest ? 'GuestContentDetail' : 'ContentDetailScreen', { 
        id: content.id,
        title: content.title
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const styles = StyleSheet.create({
    card: {
      marginBottom: theme.spacing.md,
      borderRadius: theme.borderRadius.medium,
      overflow: 'hidden',
      flex: 1,
      margin: 8,
      backgroundColor: theme.colors.surface,
      ...(horizontal ? { width: 280, marginRight: 12 } : {}),
      ...commonStyles.shadowMedium,
    },
    touchable: {
      flex: 1,
    },
    content: {
      padding: theme.spacing.md,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    headerTextContainer: {
      flex: 1,
      marginLeft: theme.spacing.sm,
    },
    typeContainer: {
      position: 'absolute',
      top: 0,
      right: 0,
      zIndex: 1,
      padding: theme.spacing.xs,
    },
    title: {
      fontSize: horizontal ? theme.fontSize.body : theme.fontSize.title,
      fontWeight: theme.fontWeight.bold,
      marginVertical: theme.spacing.sm,
      color: theme.colors.text,
    },
    meta: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    date: {
      fontSize: theme.fontSize.caption,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.xs,
    },
    description: {
      fontSize: theme.fontSize.body,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      lineHeight: 20,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.divider,
    },
    stats: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    stat: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    statValue: {
      fontSize: theme.fontSize.caption,
      color: theme.colors.textSecondary,
      marginLeft: 4,
    },
    chipContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: theme.spacing.sm,
    },
    chip: {
      marginRight: 4,
      marginBottom: 4,
      backgroundColor: theme.colors.primaryLight,
    },
    badgeContainer: {
      position: 'absolute',
      top: 8,
      right: 8,
      zIndex: 1,
    },
    favoriteBadge: {
      backgroundColor: theme.colors.secondary,
      borderRadius: theme.borderRadius.medium,
      paddingVertical: 4,
      paddingHorizontal: 8,
    },
    favoriteBadgeText: {
      color: theme.colors.text,
      fontSize: theme.fontSize.caption,
      fontWeight: theme.fontWeight.medium,
    },
    headerActionsContainer: {
      position: 'absolute',
      top: 8,
      right: 8,
      flexDirection: 'row',
      zIndex: 1,
    },
  });

  return (
    <Card style={styles.card}>
      {/* Type de contenu */}
      {content.type && (
        <View style={styles.typeContainer}>
          <CategoryBadge 
            label={content.type} 
            type={content.type} 
            size="small"
          />
        </View>
      )}

      {/* Badges et boutons d'action */}
      {isFavorite && (
        <View style={styles.badgeContainer}>
          <View style={styles.favoriteBadge}>
            <Text style={styles.favoriteBadgeText}>
              <Ionicons name="star" size={12} color={theme.colors.text} /> Favori
            </Text>
          </View>
        </View>
      )}

      {showDeleteButton && (
        <View style={styles.headerActionsContainer}>
          <DeleteContentButton 
            contentId={content.id} 
            authorId={content.authorId || content.userId || content.author?.id} 
            onDeleteSuccess={() => {
              // Callback après suppression réussie (optionnel)
            }}
          />
        </View>
      )}
      
      <TouchableOpacity onPress={handlePress} style={styles.touchable}>
        <Card.Content style={styles.content}>
          {/* Header avec avatar et auteur */}
          <View style={styles.header}>
            <UserAvatar 
              user={content.author} 
              size={horizontal ? 32 : 40} 
              showName={false}
            />
            <View style={styles.headerTextContainer}>
              <Text style={styles.meta}>
                <Text style={{ fontWeight: theme.fontWeight.medium, color: theme.colors.primary }}>
                  {content.author?.username || 'Anonyme'}
                </Text>
                <Text style={styles.date}>
                  {' • '}{formatDate(content.createdAt || new Date())}
                </Text>
              </Text>
            </View>
          </View>
          
          <Text style={styles.title} numberOfLines={2}>{content.title}</Text>
          
          <Text style={styles.description} numberOfLines={horizontal ? 2 : 3}>
            {content.body || content.description || 'Pas de description disponible.'}
          </Text>
          
          <View style={styles.footer}>
            <View style={styles.stats}>
              <View style={styles.stat}>
                <Ionicons name="eye-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={styles.statValue}>{stats.views}</Text>
              </View>
              <View style={styles.stat}>
                <Ionicons name="heart-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={styles.statValue}>{stats.likes}</Text>
              </View>
              <View style={styles.stat}>
                <Ionicons name="chatbubble-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={styles.statValue}>{stats.comments}</Text>
              </View>
            </View>
          </View>
          
          {content.tags && content.tags.length > 0 && (
            <View style={styles.chipContainer}>
              {content.tags.map((tag, index) => (
                <Chip 
                  key={index} 
                  style={styles.chip} 
                  textStyle={{fontSize: 10, color: theme.colors.surface}} 
                  mode="flat"
                >
                  {tag}
                </Chip>
              ))}
            </View>
          )}
        </Card.Content>
      </TouchableOpacity>
    </Card>
  );
};

export default ContentCard;
