import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Share, Alert } from 'react-native';
import { Text, Card, Button, ProgressBar, Divider, useTheme, IconButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDiagnosticById, updateDiagnostic } from '../store/diagnosticSlice';
import { likeDiagnostic, dislikeDiagnostic, favoriteDiagnostic } from '../store/interactionSlice';
import { Ionicons } from '@expo/vector-icons';
import useResponsive from '../hooks/useResponsive';

const DiagnosticDetailScreen = ({ route, navigation }) => {
  const { id } = route.params || {};
  const dispatch = useDispatch();
  const theme = useTheme();
  const { isMobile } = useResponsive();
  const { currentDiagnostic, isLoading } = useSelector(state => state.diagnostics);
  const [stats, setStats] = useState({ likes: 0, dislikes: 0, views: 0, favorites: 0 });
  const [userInteractions, setUserInteractions] = useState({});
  
  useEffect(() => {
    if (id) {
      dispatch(fetchDiagnosticById(id))
        .unwrap()
        .then(result => {
          if (result.stats) setStats(result.stats);
          if (result.userInteractions) setUserInteractions(result.userInteractions);
        })
        .catch(error => console.error('Error fetching diagnostic:', error));
    }
  }, [id, dispatch]);

  // Actions d'interaction
  const handleLike = () => {
    dispatch(likeDiagnostic(id))
      .unwrap()
      .then(result => {
        // Mise à jour des stats locales
        setStats(prev => ({
          ...prev,
          likes: userInteractions.like ? prev.likes - 1 : prev.likes + 1,
          dislikes: userInteractions.dislike ? prev.dislikes - 1 : prev.dislikes
        }));
        setUserInteractions(prev => ({
          ...prev,
          like: !prev.like,
          dislike: false
        }));
      });
  };

  const handleDislike = () => {
    dispatch(dislikeDiagnostic(id))
      .unwrap()
      .then(result => {
        setStats(prev => ({
          ...prev,
          dislikes: userInteractions.dislike ? prev.dislikes - 1 : prev.dislikes + 1,
          likes: userInteractions.like ? prev.likes - 1 : prev.likes
        }));
        setUserInteractions(prev => ({
          ...prev,
          dislike: !prev.dislike,
          like: false
        }));
      });
  };

  const handleFavorite = () => {
    dispatch(favoriteDiagnostic(id))
      .unwrap()
      .then(result => {
        setStats(prev => ({
          ...prev,
          favorites: userInteractions.favorite ? prev.favorites - 1 : prev.favorites + 1
        }));
        setUserInteractions(prev => ({
          ...prev,
          favorite: !prev.favorite
        }));
      });
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Découvrez le diagnostic "${currentDiagnostic?.title}" avec un score de ${currentDiagnostic?.score}%!`,
        title: currentDiagnostic?.title
      });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de partager le contenu');
    }
  };

  const handleEdit = () => {
    navigation.navigate('EditDiagnostic', { id });
  };

  const togglePublic = () => {
    if (currentDiagnostic) {
      dispatch(updateDiagnostic({ 
        id: currentDiagnostic.id, 
        data: { 
          title: currentDiagnostic.title,
          isPublic: !currentDiagnostic.isPublic 
        }
      }))
      .unwrap()
      .then(() => {
        Alert.alert('Succès', `Diagnostic marqué comme ${currentDiagnostic.isPublic ? 'privé' : 'public'}`);
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString().substring(0, 5);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#14B8A6';
    if (score >= 40) return '#F59E0B';
    if (score >= 20) return '#F97316';
    return '#EF4444';
  };

  if (isLoading || !currentDiagnostic) {
    return (
      <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  const scoreColor = getScoreColor(currentDiagnostic.score);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      padding: isMobile ? theme.spacing.md : theme.spacing.lg,
    },
    header: {
      marginBottom: theme.spacing.lg,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: 8,
    },
    metadata: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 8,
    },
    metaItem: {
      marginRight: 16,
      fontSize: 14,
      color: theme.colors.placeholder,
    },
    scoreCard: {
      marginVertical: 16,
      padding: 16,
      borderRadius: 8,
    },
    scoreHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    scoreTitle: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    scoreValue: {
      fontSize: 36,
      fontWeight: 'bold',
      color: scoreColor,
    },
    recommendationsCard: {
      marginVertical: 16,
      padding: 16,
      borderRadius: 8,
    },
    recommendationsTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    recommendationsText: {
      fontSize: 16,
      lineHeight: 24,
    },
    divider: {
      marginVertical: 16,
    },
    interactionsCard: {
      marginVertical: 16,
      padding: 16,
      borderRadius: 8,
    },
    interactionsTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 12,
    },
    interactionsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginVertical: 8,
    },
    interactionItem: {
      alignItems: 'center',
    },
    interactionCount: {
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 4,
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginVertical: 16,
    },
    buttonContainer: {
      flex: 1,
      marginHorizontal: 4,
    },
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>{currentDiagnostic.title}</Text>
        <View style={styles.metadata}>
          <Text style={styles.metaItem}>
            Complété le {formatDate(currentDiagnostic.completedAt)}
          </Text>
          <Text style={styles.metaItem}>
            {currentDiagnostic.isPublic ? 'Public' : 'Privé'}
          </Text>
        </View>
      </View>

      <Card style={styles.scoreCard}>
        <Card.Content>
          <View style={styles.scoreHeader}>
            <Text style={styles.scoreTitle}>Score global</Text>
            <Text style={styles.scoreValue}>{currentDiagnostic.score}%</Text>
          </View>
          <ProgressBar
            progress={currentDiagnostic.score / 100}
            color={scoreColor}
            style={{ height: 10, borderRadius: 5 }}
          />
        </Card.Content>
      </Card>

      <Card style={styles.recommendationsCard}>
        <Card.Content>
          <Text style={styles.recommendationsTitle}>Recommandations</Text>
          <Text style={styles.recommendationsText}>
            {currentDiagnostic.recommendations}
          </Text>
        </Card.Content>
      </Card>

      <Divider style={styles.divider} />

      <Card style={styles.interactionsCard}>
        <Card.Content>
          <Text style={styles.interactionsTitle}>Interactions</Text>
          <View style={styles.interactionsRow}>
            <View style={styles.interactionItem}>
              <IconButton
                icon="thumb-up"
                iconColor={userInteractions.like ? theme.colors.primary : theme.colors.placeholder}
                size={24}
                onPress={handleLike}
              />
              <Text style={styles.interactionCount}>{stats.likes}</Text>
            </View>
            <View style={styles.interactionItem}>
              <IconButton
                icon="thumb-down"
                iconColor={userInteractions.dislike ? theme.colors.error : theme.colors.placeholder}
                size={24}
                onPress={handleDislike}
              />
              <Text style={styles.interactionCount}>{stats.dislikes}</Text>
            </View>
            <View style={styles.interactionItem}>
              <IconButton
                icon="eye"
                iconColor={theme.colors.placeholder}
                size={24}
              />
              <Text style={styles.interactionCount}>{stats.views}</Text>
            </View>
            <View style={styles.interactionItem}>
              <IconButton
                icon="heart"
                iconColor={userInteractions.favorite ? theme.colors.error : theme.colors.placeholder}
                size={24}
                onPress={handleFavorite}
              />
              <Text style={styles.interactionCount}>{stats.favorites}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.actionsContainer}>
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            icon="pencil"
            onPress={handleEdit}
          >
            Modifier
          </Button>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            icon="share"
            onPress={handleShare}
          >
            Partager
          </Button>
        </View>
      </View>

      <Button
        mode="outlined"
        icon={currentDiagnostic.isPublic ? "eye-off" : "eye"}
        onPress={togglePublic}
        style={{ marginVertical: 8 }}
      >
        {currentDiagnostic.isPublic ? "Rendre privé" : "Rendre public"}
      </Button>
    </ScrollView>
  );
};

export default DiagnosticDetailScreen;
