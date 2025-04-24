import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Chip, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import useResponsive from '../hooks/useResponsive';

const ContentCard = ({ content }) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { isMobile } = useResponsive();

  const handlePress = () => {
    // Modifier cette ligne pour utiliser le bon nom d'écran
    navigation.navigate('ContentDetailScreen', { 
      id: content.id,
      title: content.title
    });
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
    },
    touchable: {
      flex: 1,
    },
    content: {
      padding: theme.spacing.md,
    },
    title: {
      fontSize: theme.fontSize.title,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    meta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    author: {
      fontSize: theme.fontSize.caption,
      color: theme.colors.primary,
    },
    date: {
      fontSize: theme.fontSize.caption,
      color: theme.colors.placeholder,
    },
    description: {
      fontSize: theme.fontSize.body,
      color: theme.colors.text,
      marginBottom: 16,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    stats: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    stat: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 12,
    },
    statValue: {
      fontSize: theme.fontSize.caption,
      color: theme.colors.placeholder,
      marginLeft: 4,
    },
    chipContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 8,
    },
    chip: {
      marginRight: 4,
      marginBottom: 4,
    },
  });

  return (
    <Card style={styles.card}>
      <TouchableOpacity onPress={handlePress} style={styles.touchable}>
        <Card.Content style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>{content.title}</Text>
          
          <View style={styles.meta}>
            <Text style={styles.author}>
              {content.author?.username || 'Anonyme'}
            </Text>
            <Text style={styles.date}>
              {formatDate(content.createdAt || new Date())}
            </Text>
          </View>
          
          <Text style={styles.description} numberOfLines={3}>
            {content.body || content.description || 'Pas de description disponible.'}
          </Text>
          
          <View style={styles.footer}>
            <View style={styles.stats}>
              <View style={styles.stat}>
                <Ionicons name="eye-outline" size={16} color={theme.colors.placeholder} />
                <Text style={styles.statValue}>{content.stats?.views || 0}</Text>
              </View>
              <View style={styles.stat}>
                <Ionicons name="heart-outline" size={16} color={theme.colors.placeholder} />
                <Text style={styles.statValue}>{content.stats?.likes || 0}</Text>
              </View>
              <View style={styles.stat}>
                <Ionicons name="chatbubble-outline" size={16} color={theme.colors.placeholder} />
                <Text style={styles.statValue}>{content.stats?.comments || 0}</Text>
              </View>
            </View>
          </View>
          
          {content.tags && content.tags.length > 0 && (
            <View style={styles.chipContainer}>
              {content.tags.map((tag, index) => (
                <Chip 
                  key={index} 
                  style={styles.chip} 
                  textStyle={{fontSize: 10}} 
                  mode="outlined"
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
