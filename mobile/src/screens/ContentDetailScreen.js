import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Share, Alert, TouchableOpacity } from 'react-native';
import { Text, Button, Divider, Avatar, Card, useTheme, ActivityIndicator, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchContentById, 
  toggleLike, 
  toggleDislike, 
  toggleFavorite, 
  addComment,
  recordContentView,
  loadContentInteractions,
  getContentStats,
  getContentInteractions
} from '../store/contentSlice';
import { Ionicons } from '@expo/vector-icons';
import useResponsive from '../hooks/useResponsive';

const ContentDetailScreen = ({ route, navigation }) => {
  const { id } = route.params || {};
  const dispatch = useDispatch();
  const theme = useTheme();
  const { isMobile } = useResponsive();
  const { currentContent, isLoading, error } = useSelector(state => state.contents);
  const { isAuthenticated } = useSelector(state => state.auth);
  const [comment, setComment] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Fonction de chargement initial qui récupère toutes les données nécessaires
    const loadInitialData = async () => {
      setRefreshing(true);
      try {
        // Charger les détails du contenu
        await dispatch(fetchContentById(id)).unwrap();
        
        // Charger les statistiques et les interactions en parallèle
        await Promise.all([
          dispatch(getContentStats(id)).unwrap(),
          dispatch(getContentInteractions(id)).unwrap(),
          dispatch(recordContentView(id)).unwrap() // Enregistrer la vue
        ]);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        Alert.alert('Erreur', 'Impossible de charger le contenu pour le moment');
      } finally {
        setRefreshing(false);
      }
    };

    loadInitialData();
  }, [dispatch, id]);

  const reloadAllData = async () => {
    setRefreshing(true);
    try {
      // Recharger le contenu
      await dispatch(fetchContentById(id)).unwrap();
      
      // Recharger les statistiques
      await dispatch(getContentStats(id)).unwrap();
      
      // Recharger les interactions si l'utilisateur est connecté
      if (isAuthenticated) {
        await dispatch(getContentInteractions(id)).unwrap();
      }
    } catch (error) {
      console.error('Erreur lors du rechargement des données:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Actions d'interaction
  const handleLike = async () => {
    if (!isAuthenticated) {
      Alert.alert('Connexion requise', 'Vous devez être connecté pour aimer ce contenu');
      return;
    }
    
    try {
      await dispatch(toggleLike(id)).unwrap();
      
      // Recharger les statistiques et interactions après l'action
      await dispatch(getContentStats(id)).unwrap();
      await dispatch(getContentInteractions(id)).unwrap();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ajouter un like pour le moment');
    }
  };

  const handleDislike = async () => {
    if (!isAuthenticated) {
      Alert.alert('Connexion requise', 'Vous devez être connecté pour ne pas aimer ce contenu');
      return;
    }
    
    setRefreshing(true);
    try {
      await dispatch(toggleDislike(id)).unwrap();
      await dispatch(getContentStats(id)).unwrap(); // Recharger les stats
      await dispatch(getContentInteractions(id)).unwrap(); // Recharger les interactions
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ajouter un dislike pour le moment');
    } finally {
      setRefreshing(false);
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      Alert.alert('Connexion requise', 'Vous devez être connecté pour ajouter aux favoris');
      return;
    }
    
    setRefreshing(true);
    try {
      await dispatch(toggleFavorite(id)).unwrap();
      await dispatch(getContentStats(id)).unwrap(); // Recharger les stats
      await dispatch(getContentInteractions(id)).unwrap(); // Recharger les interactions
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ajouter aux favoris pour le moment');
    } finally {
      setRefreshing(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Découvrez cet article sur CesiZen: ${currentContent?.title}`,
        title: currentContent?.title,
      });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de partager ce contenu pour le moment');
    }
  };

  const handleSubmitComment = async () => {
    if (!isAuthenticated) {
      Alert.alert('Connexion requise', 'Vous devez être connecté pour commenter');
      return;
    }
    
    if (!comment.trim()) {
      Alert.alert('Erreur', 'Votre commentaire ne peut pas être vide');
      return;
    }
    
    setRefreshing(true);
    try {
      await dispatch(addComment({ contentId: id, text: comment })).unwrap();
      setComment('');
      reloadAllData(); // Recharger toutes les données pour voir le nouveau commentaire
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ajouter votre commentaire pour le moment');
    } finally {
      setRefreshing(false);
    }
  };

  const renderComments = () => {
    // S'assurer que comments est un tableau, même s'il est undefined
    const commentsList = currentContent.Comments || currentContent.comments || [];
    
    if (commentsList.length === 0) {
      return (
        <Text style={{fontStyle: 'italic', color: theme.colors.placeholder}}>
          Aucun commentaire pour le moment.
        </Text>
      );
    }
    
    return commentsList.map((comment, index) => (
      <Card key={index} style={styles.commentCard}>
        <Card.Content>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4}}>
            <Text style={styles.commentAuthor}>
              {comment.user?.username || 'Utilisateur anonyme'}
            </Text>
            <Text style={styles.commentDate}>
              {formatDate(comment.createdAt)}
            </Text>
          </View>
          <Text>{comment.content || comment.text}</Text>
        </Card.Content>
      </Card>
    ));
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 12,
    },
    meta: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    authorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    authorName: {
      marginLeft: 8,
      fontSize: 14,
      color: theme.colors.primary,
    },
    date: {
      marginLeft: 16,
      fontSize: 12,
      color: theme.colors.placeholder,
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 24,
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 16,
      paddingHorizontal: 8,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 8,
    },
    actionText: {
      marginLeft: 4,
      fontSize: 14,
    },
    statsContainer: {
      flexDirection: 'row',
      marginBottom: 16,
      marginTop: 8,
    },
    stat: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 16,
    },
    statValue: {
      marginLeft: 4,
      color: theme.colors.placeholder,
    },
    commentsHeader: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 16,
      marginBottom: 8,
    },
    commentCard: {
      marginBottom: 8,
    },
    commentAuthor: {
      fontWeight: 'bold',
      fontSize: 14,
    },
    commentDate: {
      fontSize: 12,
      color: theme.colors.placeholder,
    },
    commentInput: {
      marginTop: 16,
      marginBottom: 8,
    },
    loading: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    error: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    errorText: {
      color: theme.colors.error,
      marginBottom: 20,
      textAlign: 'center',
    }
  });

  // États de chargement et erreur
  if (isLoading && !currentContent) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text>Chargement du contenu...</Text>
      </View>
    );
  }

  if (error && !currentContent) {
    return (
      <View style={styles.error}>
        <Text style={styles.errorText}>{error}</Text>
        <Button mode="contained" onPress={reloadAllData}>Réessayer</Button>
      </View>
    );
  }

  if (!currentContent) {
    return (
      <View style={styles.error}>
        <Text style={styles.errorText}>Contenu introuvable</Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>Retour</Button>
      </View>
    );
  }

  // Ajoutez des logs pour déboguer
  console.log('Current content:', currentContent);
  console.log('User interactions:', currentContent?.userInteractions);
  console.log('Stats:', currentContent?.stats);

  // Assurez-vous que les données sont correctement initialisées
  const userInteractions = currentContent.userInteractions || {};
  const stats = currentContent.stats || { 
    views: 0, 
    likes: 0, 
    dislikes: 0,
    favorites: 0
  };

  // Données du contenu
  const comments = currentContent.comments || [];

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>{currentContent.title}</Text>
      
      <View style={styles.meta}>
        <View style={styles.authorContainer}>
          <Avatar.Text 
            size={24} 
            label={(currentContent.author?.username || 'U').substring(0, 2).toUpperCase()}
            color="white"
          />
          <Text style={styles.authorName}>
            {currentContent.author?.username || 'Utilisateur inconnu'}
          </Text>
        </View>
        <Text style={styles.date}>{formatDate(currentContent.createdAt)}</Text>
      </View>
      
      <Text style={styles.body}>{currentContent.body}</Text>
      
      {/* Statistiques */}
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Ionicons name="eye-outline" size={16} color={theme.colors.placeholder} />
          <Text style={styles.statValue}>{stats.views || 0}</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="heart-outline" size={16} color={theme.colors.placeholder} />
          <Text style={styles.statValue}>{stats.likes || 0}</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="thumbs-down-outline" size={16} color={theme.colors.placeholder} />
          <Text style={styles.statValue}>{stats.dislikes || 0}</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="chatbubble-outline" size={16} color={theme.colors.placeholder} />
          <Text style={styles.statValue}>{comments.length || 0}</Text>
        </View>
      </View>
      
      {/* Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Ionicons 
            name={userInteractions.like ? "heart" : "heart-outline"} 
            size={20} 
            color={userInteractions.like ? theme.colors.primary : theme.colors.text} 
          />
          <Text style={[styles.actionText, userInteractions.like && {color: theme.colors.primary}]}>
            J'aime
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleDislike}>
          <Ionicons 
            name={userInteractions.dislike ? "thumbs-down" : "thumbs-down-outline"} 
            size={20} 
            color={userInteractions.dislike ? theme.colors.error : theme.colors.text} 
          />
          <Text style={[styles.actionText, userInteractions.dislike && {color: theme.colors.error}]}>
            Je n'aime pas
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleFavorite}>
          <Ionicons 
            name={userInteractions.favorite ? "bookmark" : "bookmark-outline"} 
            size={20} 
            color={userInteractions.favorite ? theme.colors.primary : theme.colors.text} 
          />
          <Text style={[styles.actionText, userInteractions.favorite && {color: theme.colors.primary}]}>
            Favori
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Ionicons name="share-social-outline" size={20} color={theme.colors.text} />
          <Text style={styles.actionText}>Partager</Text>
        </TouchableOpacity>
      </View>
      
      <Divider />
      
      {/* Commentaires */}
      <Text style={styles.commentsHeader}>
        Commentaires ({comments.length || 0})
      </Text>
      
      {renderComments()}
      
      {/* Ajouter un commentaire */}
      <TextInput
        label="Ajouter un commentaire"
        value={comment}
        onChangeText={setComment}
        style={styles.commentInput}
        multiline
        disabled={!isAuthenticated || refreshing}
      />
      
      <Button 
        mode="contained" 
        onPress={handleSubmitComment}
        disabled={!isAuthenticated || !comment.trim() || refreshing}
        loading={refreshing}
      >
        Commenter
      </Button>
      
      <Button 
        mode="outlined" 
        onPress={() => navigation.goBack()}
        style={{marginTop: 16}}
      >
        Retour
      </Button>
    </ScrollView>
  );
};

export default ContentDetailScreen;
