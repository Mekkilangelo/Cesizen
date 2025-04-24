import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { Text, Searchbar, useTheme, Button, Chip } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLatestContent } from '../store/contentSlice';
import ContentCard from '../components/ContentCard';
import useResponsive from '../hooks/useResponsive';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const { latestContent, isLoading, error } = useSelector(state => state.contents);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrer les contenus par type
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [filteredContent, setFilteredContent] = useState([]);

  useEffect(() => {
    loadContent();
  }, []);

  useEffect(() => {
    if (latestContent) {
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
      
      setFilteredContent(filtered);
    }
  }, [latestContent, selectedFilter, searchQuery]);

  const loadContent = async () => {
    setRefreshing(true);
    await dispatch(fetchLatestContent());
    setRefreshing(false);
  };

  const handleRefresh = () => {
    loadContent();
  };

  const handleSearch = query => {
    setSearchQuery(query);
  };

  const handleFilterChange = filter => {
    setSelectedFilter(filter);
  };

  // Calculer le nombre de colonnes en fonction de la largeur d'écran
  const getNumColumns = () => {
    if (isDesktop) return 3;
    if (isTablet) return 2;
    return 1;
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
    },
    title: {
      fontSize: theme.fontSize.heading,
      fontWeight: 'bold',
      marginBottom: theme.spacing.sm,
    },
    description: {
      fontSize: theme.fontSize.body,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    searchBar: {
      marginBottom: theme.spacing.md,
      borderRadius: theme.borderRadius.medium,
      elevation: 2,
    },
    filterContainer: {
      flexDirection: 'row',
      marginBottom: theme.spacing.md,
      paddingHorizontal: theme.spacing.sm,
    },
    filterChip: {
      marginRight: theme.spacing.sm,
    },
    noContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    noContentText: {
      fontSize: theme.fontSize.title,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
    errorContainer: {
      padding: theme.spacing.lg,
      alignItems: 'center',
    },
    errorText: {
      color: theme.colors.error,
      marginBottom: theme.spacing.md,
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
  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.noContent}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: theme.spacing.md }}>Chargement des contenus...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Une erreur est survenue: {error}
          </Text>
          <Button mode="contained" onPress={loadContent}>
            Réessayer
          </Button>
        </View>
      );
    }

    return (
      <View style={styles.noContent}>
        <Text style={styles.noContentText}>
          {searchQuery || selectedFilter !== 'all' 
            ? "Aucun contenu ne correspond à votre recherche"
            : "Aucun contenu n'est disponible pour le moment"}
        </Text>
        <Button mode="contained" onPress={loadContent}>
          Actualiser
        </Button>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Découvrir le contenu</Text>
        <Text style={styles.description}>
          Explorez les derniers articles, ressources et tutoriels partagés par la communauté.
        </Text>
      </View>

      <Searchbar
        placeholder="Rechercher..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
      />

      {renderFilters()}

      <FlatList
        data={filteredContent}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <ContentCard content={item} />}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
        numColumns={getNumColumns()}
        key={getNumColumns()} // Force re-render when columns change
      />
    </View>
  );
};

export default HomeScreen;
