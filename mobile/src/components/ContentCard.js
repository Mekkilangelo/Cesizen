import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Card, Text, Chip, useTheme, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import useResponsive from '../hooks/useResponsive';

const ContentCard = ({ content }) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { isMobile } = useResponsive();
  
  const handlePress = () => {
    navigation.navigate('ContentDetail', { 
      id: content.id,
      title: content.title
    });
  };

  // Styles adaptés au mobile
  const styles = StyleSheet.create({
    card: {
      marginVertical: theme.spacing.sm,
      marginHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.medium,
    },
    cardContent: {
      padding: theme.spacing.md,
    },
    title: {
      fontSize: theme.fontSize.title,
      fontWeight: 'bold',
      marginBottom: theme.spacing.xs,
      color: theme.colors.text,
    },
    meta: {
      flexDirection: 'row',
      marginBottom: theme.spacing.sm,
      alignItems: 'center',
    },
    author: {
      fontSize: theme.fontSize.caption,
      color: theme.colors.placeholder,
    },
    date: {
      fontSize: theme.fontSize.caption,
      color: theme.colors.placeholder,
      marginLeft: theme.spacing.sm,
    },
    dot: {
      width: 3,
      height: 3,
      borderRadius: 1.5,
      backgroundColor: theme.colors.placeholder,
      marginHorizontal: theme.spacing.xs,
    },
    typeChip: {
      marginLeft: 'auto',
    },
    chipText: {
      fontSize: 10,
    },
    excerpt: {
      fontSize: theme.fontSize.body,
      color: theme.colors.text,
      marginVertical: theme.spacing.sm,
      lineHeight: 20,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: theme.spacing.sm,
    },
    stats: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    statValue: {
      marginLeft: 4,
      fontSize: theme.fontSize.caption,
      color: theme.colors.placeholder,
    },
    readMore: {
      color: theme.colors.primary,
      fontWeight: '500',
    },
    touchableArea: {
      padding: isMobile ? 8 : 4,
    },
    tags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: theme.spacing.xs,
    },
    tag: {
      marginRight: theme.spacing.xs,
      marginBottom: theme.spacing.xs,
      backgroundColor: '#E0F2F1',
    },
  });

  // Formatage de la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Extraction des 150 premiers caractères
  const getExcerpt = (body) => {
    if (!body) return '';
    return body.length > 150 ? body.substring(0, 150) + '...' : body;
  };

  return (
    <Card style={styles.card} onPress={handlePress}>
      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={2}>{content.title}</Text>
        
        <View style={styles.meta}>
          <Text style={styles.author}>
            {content.author?.username || 'Auteur inconnu'}
          </Text>
          <View style={styles.dot} />
          <Text style={styles.date}>{formatDate(content.createdAt)}</Text>
          
          <Chip 
            style={styles.typeChip} 
            textStyle={styles.chipText}
            mode="outlined"
          >
            {content.type === 'article' ? 'Article' : 
             content.type === 'resource' ? 'Ressource' : 'Tutoriel'}
          </Chip>
        </View>
        
        <Text style={styles.excerpt} numberOfLines={isMobile ? 3 : 4}>
          {getExcerpt(content.body)}
        </Text>
        
        {content.tags && content.tags.length > 0 && (
          <View style={styles.tags}>
            {content.tags.slice(0, 3).map((tag, index) => (
              <Chip key={index} style={styles.tag} small>
                {tag}
              </Chip>
            ))}
            {content.tags.length > 3 && (
              <Chip small>+{content.tags.length - 3}</Chip>
            )}
          </View>
        )}
        
        <View style={styles.footer}>
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Ionicons name="eye-outline" size={16} color={theme.colors.placeholder} />
              <Text style={styles.statValue}>{content.stats?.views || 0}</Text>
            </View>
            
            <View style={styles.statItem}>
              <Ionicons name="heart-outline" size={16} color={theme.colors.placeholder} />
              <Text style={styles.statValue}>{content.stats?.likes || 0}</Text>
            </View>
            
            <View style={styles.statItem}>
              <Ionicons name="chatbubble-outline" size={16} color={theme.colors.placeholder} />
              <Text style={styles.statValue}>{content.comments?.length || 0}</Text>
            </View>
          </View>
          
          <Text style={styles.readMore}>Lire plus</Text>
        </View>
      </View>
    </Card>
  );
};

export default ContentCard;
