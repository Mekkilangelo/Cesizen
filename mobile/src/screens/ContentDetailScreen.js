import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Share, TouchableOpacity } from 'react-native';
import { Text, Button, IconButton, Divider, Avatar, Card, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContentById, toggleFavorite } from '../store/contentSlice';
import { Ionicons } from '@expo/vector-icons';
import useResponsive from '../hooks/useResponsive';

const ContentDetailScreen = ({ route, navigation }) => {
  const { id, title } = route.params || {};
  const dispatch = useDispatch();
  const theme = useTheme();
  const { isMobile } = useResponsive();
  const { currentContent, isLoading } = useSelector(state => state.contents);

  // Simuler un contenu pour le développement
  const mockContent = currentContent || {
    id: id || 1,
    title: title || 'Comment améliorer la productivité de votre entreprise',
    body: `
    L'amélioration de la productivité est cruciale pour toute entreprise souhaitant rester compétitive. Voici quelques conseils pratiques pour augmenter l'efficacité de votre équipe sans sacrifier la qualité du travail ou le bien-être des employés.

    **1. Optimiser l'environnement de travail**
    Un espace de travail bien conçu favorise la concentration et réduit les distractions. Assurez-vous que vos employés disposent de tout le matériel nécessaire et d'un environnement confortable.

    **2. Investir dans la formation continue**
    Des employés bien formés sont plus efficaces. Proposez régulièrement des formations pour améliorer leurs compétences techniques et leur savoir-faire.

    **3. Encourager la communication**
    Une communication fluide entre les équipes permet d'éviter les malentendus et les retards. Mettez en place des outils adaptés et encouragez les échanges constructifs.
    `,
    author: {
      id: 2,
      username: 'ExpertConseil'
    },
    createdAt: new Date().toISOString(),
    type: 'article',
    tags: ['Productivité', 'Management', 'Ressources Humaines'],
    stats: {
      views: 1243,
      likes: 89,
      dislikes: 3
    },
    comments: [
      {
        id: 1,
        user: { id: 3, username: 'Marie' },
        content: 'Excellents conseils, merci !',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        user: { id: 4, username: 'Thomas' },
        content: 'J\'ai appliqué la méthode n°2 et les résultats sont impressionnants.',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ],
    isFavorite: false
  };

  useEffect(() => {
    if (id) {
      // Décommenter pour utiliser l'API réelle
      // dispatch(fetchContentById(id));
      
      // Pour le développement, nous utilisons les données simulées
    }
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Découvrez cet article sur CesiZen: ${mockContent.title}`,
      });
    } catch (error) {
      alert(`Erreur lors du partage: ${error.message}`);
    }
  };

  const handleFavorite = () => {
    // Décommenter pour utiliser l'API réelle
    // dispatch(toggleFavorite(mockContent.id));
    
    // Pour le développement
    alert(`${mockContent.isFavorite ? 'Retrait des favoris' : 'Ajout aux favoris'}`);
  };

  const handleComment = () => {
    alert('Ajouter un commentaire');
  };

  const TouchableWithText = ({ children, style, onPress }) => (
    <TouchableOpacity style={style} onPress={onPress}>
      <Text style={styles.actionText}>{children}</Text>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: theme.spacing.md,
      maxWidth: isMobile ? undefined : 800,
      alignSelf: isMobile ? undefined : 'center',
      width: '100%',
    },
    header: {
      marginBottom: theme.spacing.lg,
    },
    title: {
      fontSize: theme.fontSize.largeHeading,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    meta: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    authorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    authorName: {
      marginLeft: theme.spacing.xs,
      fontSize: theme.fontSize.body,
      color: theme.colors.primary,
    },
    date: {
      marginLeft: theme.spacing.md,
      fontSize: theme.fontSize.caption,
      color: theme.colors.placeholder,
    },
    tags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: theme.spacing.md,
    },
    tag: {
      backgroundColor: '#E0F2F1',
      marginRight: theme.spacing.xs,
      marginBottom: theme.spacing.xs,
    },
    body: {
      fontSize: theme.fontSize.body,
      lineHeight: 24,
      color: theme.colors.text,
      marginBottom: theme.spacing.xl,
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.lg,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.sm,
    },
    actionText: {
      marginLeft: theme.spacing.xs,
      color: theme.colors.primary,
    },
    statsContainer: {
      flexDirection: 'row',
      marginBottom: theme.spacing.lg,
    },
    stat: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: theme.spacing.lg,
    },
    statValue: {
      marginLeft: theme.spacing.xs,
      color: theme.colors.placeholder,
    },
    commentsHeader: {
      fontSize: theme.fontSize.title,
      fontWeight: 'bold',
      marginBottom: theme.spacing.md,
    },
    commentCard: {
      marginBottom: theme.spacing.md,
    },
    commentHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    commentAuthor: {
      fontWeight: 'bold',
      marginLeft: theme.spacing.xs,
    },
    commentDate: {
      fontSize: theme.fontSize.caption,
      color: theme.colors.placeholder,
      marginLeft: 'auto',
    },
    commentContent: {
      fontSize: theme.fontSize.body,
    },
    addCommentButton: {
      marginTop: theme.spacing.md,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{mockContent.title}</Text>
          
          <View style={styles.meta}>
            <View style={styles.authorContainer}>
              <Avatar.Text 
                size={24} 
                label={mockContent.author.username.substring(0, 2)} 
                color="white"
                style={{ backgroundColor: theme.colors.primary }}
              />
              <Text style={styles.authorName}>{mockContent.author.username}</Text>
            </View>
            <Text style={styles.date}>{formatDate(mockContent.createdAt)}</Text>
          </View>
          
          <View style={styles.tags}>
            {mockContent.tags.map((tag, index) => (
              <Button
                key={index}
                mode="outlined"
                style={styles.tag}
                compact
              >
                {tag}
              </Button>
            ))}
          </View>
        </View>
        
        <Text style={styles.body}>{mockContent.body}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Ionicons name="eye-outline" size={20} color={theme.colors.placeholder} />
            <Text style={styles.statValue}>{mockContent.stats.views}</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="heart-outline" size={20} color={theme.colors.placeholder} />
            <Text style={styles.statValue}>{mockContent.stats.likes}</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="chatbubble-outline" size={20} color={theme.colors.placeholder} />
            <Text style={styles.statValue}>{mockContent.comments.length}</Text>
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleFavorite}>
            <Ionicons 
              name={mockContent.isFavorite ? "heart" : "heart-outline"} 
              size={24} 
              color={mockContent.isFavorite ? theme.colors.error : theme.colors.primary} 
            />
            <Text style={styles.actionText}>
              {mockContent.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color={theme.colors.primary} />
            <Text style={styles.actionText}>Partager</Text>
          </TouchableOpacity>
        </View>
        
        <Divider />
        
        <View style={{ marginTop: theme.spacing.lg }}>
          <Text style={styles.commentsHeader}>
            Commentaires ({mockContent.comments.length})
          </Text>
          
          {mockContent.comments.map(comment => (
            <Card key={comment.id} style={styles.commentCard}>
              <Card.Content>
                <View style={styles.commentHeader}>
                  <Avatar.Text 
                    size={24} 
                    label={comment.user.username.substring(0, 2)} 
                    color="white"
                    style={{ backgroundColor: theme.colors.secondary }}
                  />
                  <Text style={styles.commentAuthor}>{comment.user.username}</Text>
                  <Text style={styles.commentDate}>{formatDate(comment.createdAt)}</Text>
                </View>
                <Text style={styles.commentContent}>{comment.content}</Text>
              </Card.Content>
            </Card>
          ))}
          
          <Button 
            mode="contained" 
            onPress={handleComment}
            style={styles.addCommentButton}
            icon="comment-plus"
          >
            Ajouter un commentaire
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default ContentDetailScreen;
