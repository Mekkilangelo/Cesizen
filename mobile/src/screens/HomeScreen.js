import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, ActivityIndicator, ScrollView } from 'react-native';
import { Text, Searchbar, useTheme, Button, Chip, Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLatestContent, fetchUserContents, fetchFavoriteContents } from '../store/contentSlice';
import ContentCard from '../components/ContentCard';
import useResponsive from '../hooks/useResponsive';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const theme = useTheme();
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const { latestContent, userContents, favoriteContents, isLoading, error } = useSelector(state => state.contents);
  const { user } = useSelector(state => state.auth);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrer les contenus par type
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [filteredPublicContent, setFilteredPublicContent] = useState([]);

  useEffect(() => {
    loadContent();
  }, [dispatch]); // ✅ Ajouter dispatch dans les dépendances

  useEffect(() => {
    if (latestContent && latestContent.length > 0) {
      // Appliquer les filtres
      let filtered = [...latestContent];
      
      // Filtrer par type
      if (selectedFilter !== 'all') {
        filtered = filtered.filter(content => content.type === selectedFilter);
      }
      
      // Filtrer par recherche
      if (searchQuery) {
        filtered = filtered.filter(content => 
          content.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          content.body?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      setFilteredPublicContent(filtered);
    }
  }, [latestContent, selectedFilter, searchQuery]);

  const loadContent = useCallback(async () => {
    setRefreshing(true);
    try {
      // Charger tous les contenus requis en parallèle
      await Promise.all([
        dispatch(fetchLatestContent()),
        dispatch(fetchUserContents()),
        dispatch(fetchFavoriteContents())
      ]);
    } catch (error) {
      console.error('Erreur lors du chargement des contenus:', error);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  const handleRefresh = () => {
    loadContent();
  };

  const handleSearch = query => {
    setSearchQuery(query);
  };

  const handleFilterChange = filter => {
    setSelectedFilter(filter);
  };

  const handleContentPress = (content) => {
    navigation.navigate('ContentDetailScreen', { 
      id: content.id,
      title: content.title
    });
  };

  // Styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: isMobile ? theme.spacing.sm : theme.spacing.md,
    },
    header: {
      marginBottom: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.md,
    },
    title: {
      fontSize: theme.fontSize.heading,
      fontWeight: 'bold',
      marginBottom: theme.spacing.sm,
    },
    sectionTitle: {
      fontSize: theme.fontSize.title,
      fontWeight: 'bold',
      marginVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
    },
    description: {
      fontSize: theme.fontSize.body,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    searchBar: {
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderRadius: theme.borderRadius.medium,
      elevation: 2,
    },
    filterContainer: {
      flexDirection: 'row',
      marginBottom: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      flexWrap: 'wrap',
    },
    filterChip: {
      marginRight: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    noContent: {
      padding: theme.spacing.xl,
      alignItems: 'center',
    },
    noContentText: {
      fontSize: theme.fontSize.body,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
      color: theme.colors.placeholder,
    },
    errorContainer: {
      padding: theme.spacing.lg,
      alignItems: 'center',
    },
    errorText: {
      color: theme.colors.error,
      marginBottom: theme.spacing.md,
    },
    sectionContainer: {
      marginBottom: theme.spacing.lg,
    },
    horizontalList: {
      paddingHorizontal: theme.spacing.sm,
    },
    divider: {
      marginVertical: theme.spacing.md,
    },
    viewAllButton: {
      alignSelf: 'flex-end',
      marginRight: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    supportButton: {
      marginTop: theme.spacing.md,
      borderColor: theme.colors.primary,
      borderRadius: theme.borderRadius.medium,
    },
    supportButtonContent: {
      flexDirection: 'row-reverse',
    }
  });

  // Rendu des filtres
  const renderFilters = () => (
    <View style={styles.filterContainer}>
      <Chip 
        selected={selectedFilter === 'all'} 
        onPress={() => handleFilterChange('all')}
        style={styles.filterChip}
      >
        Tous
      </Chip>
      <Chip 
        selected={selectedFilter === 'article'} 
        onPress={() => handleFilterChange('article')}
        style={styles.filterChip}
      >
        Articles
      </Chip>
      <Chip 
        selected={selectedFilter === 'resource'} 
        onPress={() => handleFilterChange('resource')}
        style={styles.filterChip}
      >
        Ressources
      </Chip>
      <Chip 
        selected={selectedFilter === 'tutorial'} 
        onPress={() => handleFilterChange('tutorial')}
        style={styles.filterChip}
      >
        Tutoriels
      </Chip>
    </View>
  );

  // Rendu des états vides
  const renderEmptyState = (message = "Aucun contenu n'est disponible pour le moment") => (
    <View style={styles.noContent}>
      <Text style={styles.noContentText}>{message}</Text>
    </View>
  );

  const renderUserContentSection = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Mes articles avec un s</Text>
      {isLoading && !refreshing ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : userContents && userContents.length > 0 ? (
        <>
          <FlatList
            horizontal
            data={userContents.slice(0, 5)}
            keyExtractor={item => `user-${item.id}`}
            renderItem={({ item }) => (
              <ContentCard 
                content={item} 
                horizontal={true} 
                onPress={() => handleContentPress(item)}
                showDeleteButton={true}
              />
            )}
            contentContainerStyle={styles.horizontalList}
            showsHorizontalScrollIndicator={false}
          />
          {userContents.length > 5 && (
            <Button 
              mode="text" 
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('MyContents')}
            >
              Voir tous mes articles
            </Button>
          )}
        </>
      ) : renderEmptyState("Vous n'avez pas encore créé d'articles")}
    </View>
  );

  const renderFavoritesSection = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Mes favoris</Text>
      {isLoading && !refreshing ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : favoriteContents && favoriteContents.length > 0 ? (
        <>
          <FlatList
            horizontal
            data={favoriteContents.slice(0, 5)}
            keyExtractor={item => `fav-${item.id}`}
            renderItem={({ item }) => (
              <ContentCard 
                content={item} 
                horizontal={true} 
                onPress={() => handleContentPress(item)}
                isFavorite={true}
              />
            )}
            contentContainerStyle={styles.horizontalList}
            showsHorizontalScrollIndicator={false}
          />
          {favoriteContents.length > 5 && (
            <Button 
              mode="text" 
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('Favorites')}
            >
              Voir tous mes favoris
            </Button>
          )}
        </>
      ) : renderEmptyState("Vous n'avez pas encore ajouté d'articles aux favoris")}
    </View>
  );

  const renderPublicContentSection = () => (
    <View style={styles.sectionContainer} testID="user-content-list">
      <Text style={styles.sectionTitle}>Articles publics</Text>
      
      <Searchbar
        placeholder="Rechercher..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
      />

      {renderFilters()}

      {isLoading && !refreshing ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : filteredPublicContent && filteredPublicContent.length > 0 ? (
        <FlatList
          data={filteredPublicContent}
          keyExtractor={item => `public-${item.id}`}
          renderItem={({ item }) => (
            <ContentCard 
              content={item} 
              onPress={() => handleContentPress(item)}
              showDeleteButton={user && (user.role === 'admin' || user.id === item.authorId || user.id === item.userId || user.id === item.author?.id)}
              testID="content-card"
            />
          )}
          contentContainerStyle={styles.content}
          numColumns={getNumColumns()}
        />
      ) : renderEmptyState(
        searchQuery || selectedFilter !== 'all' 
          ? "Aucun contenu ne correspond à votre recherche"
          : "Aucun contenu public n'est disponible pour le moment"
      )}
    </View>
  );

  // Calculer le nombre de colonnes en fonction de la largeur d'écran
  const getNumColumns = () => {
    if (isDesktop) return 3;
    if (isTablet) return 2;
    return 1;
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      testID="home-screen-container"
    >
      <View style={styles.header}>
        <Text style={styles.title} testID="username-display">Bienvenue, {user?.username || 'utilisateur'}</Text>
        <Text style={styles.description}>
          Explorez les derniers articles, gérez vos favoris et vos publications.
        </Text>
        
        <Button 
          mode="outlined" 
          icon="help-circle-outline" 
          onPress={() => navigation.navigate('TicketScreen')}
          style={styles.supportButton}
          contentStyle={styles.supportButtonContent}
        >
          Besoin d'aide ?
        </Button>
      </View>

      {renderUserContentSection()}
      
      <Divider style={styles.divider} />
      
      {renderFavoritesSection()}
      
      <Divider style={styles.divider} />
      
      {renderPublicContentSection()}
    </ScrollView>
  );
};

export default HomeScreen;
