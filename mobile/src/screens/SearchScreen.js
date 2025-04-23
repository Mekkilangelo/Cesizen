import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Searchbar, Chip, Text, useTheme, Divider, ActivityIndicator, Paragraph } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import ContentCard from '../components/ContentCard';
import DiagnosticCard from '../components/DiagnosticCard';
import useResponsive from '../hooks/useResponsive';

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState(['diagnostic entreprise', 'améliorer productivité', 'marketing digital']);
  const theme = useTheme();
  const { isMobile } = useResponsive();
  const dispatch = useDispatch();

  // Simuler une recherche
  const performSearch = (query) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    
    setIsLoading(true);
    
    // Simuler un délai de chargement
    setTimeout(() => {
      // Données simulées pour le développement
      const mockResults = [
        {
          id: 1,
          type: 'content',
          title: 'Comment améliorer la productivité',
          author: { username: 'ExpertConseil' },
          createdAt: new Date().toISOString(),
          body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          contentType: 'article',
          tags: ['Productivité', 'Management'],
          stats: { views: 1245, likes: 87 }
        },
        {
          id: 2,
          type: 'diagnostic',
          title: 'Diagnostic RH 2023',
          score: 68,
          completedAt: new Date().toISOString(),
          recommendations: 'Recommandations pour améliorer votre gestion RH...',
          isPublic: true
        },
        {
          id: 3,
          type: 'content',
          title: 'Stratégies de marketing digital',
          author: { username: 'MarketingPro' },
          createdAt: new Date().toISOString(),
          body: 'Découvrez les meilleures stratégies pour votre présence en ligne...',
          contentType: 'resource',
          tags: ['Marketing', 'Digital', 'Social Media'],
          stats: { views: 842, likes: 63 }
        }
      ];
      
      // Filtrer les résultats selon le filtre actif
      let filteredResults = mockResults;
      if (activeFilter !== 'all') {
        filteredResults = mockResults.filter(item => item.type === activeFilter);
      }
      
      setResults(filteredResults);
      setIsLoading(false);
      
      // Ajouter à l'historique de recherche si ce n'est pas déjà présent
      if (!recentSearches.includes(query) && query.trim()) {
        setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
      }
    }, 1000);
  };

  // Soumettre la recherche
  const onSubmitSearch = () => {
    performSearch(searchQuery);
  };

  // Effacer la recherche
  const clearSearch = () => {
    setSearchQuery('');
    setResults([]);
  };

  // Styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    searchContainer: {
      padding: theme.spacing.md,
      paddingBottom: theme.spacing.xs,
    },
    searchbar: {
      elevation: 2,
      borderRadius: theme.borderRadius.medium,
    },
    filterContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: theme.spacing.sm,
    },
    chip: {
      marginRight: theme.spacing.sm,
      marginBottom: theme.spacing.xs,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    resultsContainer: {
      flex: 1,
      padding: isMobile ? 0 : theme.spacing.md,
    },
    recentSearchesContainer: {
      padding: theme.spacing.md,
    },
    sectionTitle: {
      fontSize: theme.fontSize.title,
      fontWeight: 'bold',
      marginBottom: theme.spacing.md,
    },
    recentSearchItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: '#F3F4F6',
    },
    recentSearchText: {
      marginLeft: theme.spacing.sm,
      flex: 1,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    emptyText: {
      fontSize: theme.fontSize.title,
      color: theme.colors.placeholder,
      textAlign: 'center',
      marginTop: theme.spacing.lg,
    },
    emptySubText: {
      fontSize: theme.fontSize.body,
      color: theme.colors.placeholder,
      textAlign: 'center',
      marginTop: theme.spacing.md,
    },
    resultTypeHeader: {
      padding: theme.spacing.md,
      backgroundColor: '#F9FAFB',
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
    },
    resultTypeText: {
      fontSize: theme.fontSize.body,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
  });

  // Rendu pour chaque élément de résultat
  const renderResultItem = ({ item }) => {
    if (item.type === 'content') {
      return <ContentCard content={item} />;
    } else if (item.type === 'diagnostic') {
      return <DiagnosticCard diagnostic={item} onFavorite={() => {}} onShare={() => {}} />;
    }
    return null;
  };

  // Rendu de l'état vide ou des résultats
  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: theme.spacing.md }}>Recherche en cours...</Text>
        </View>
      );
    }

    if (searchQuery && results.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={64} color={theme.colors.placeholder} />
          <Text style={styles.emptyText}>
            Aucun résultat trouvé
          </Text>
          <Text style={styles.emptySubText}>
            Essayez d'autres termes de recherche
          </Text>
        </View>
      );
    }

    if (results.length > 0) {
      return (
        <FlatList
          data={results}
          renderItem={renderResultItem}
          keyExtractor={item => `${item.type}-${item.id}`}
          contentContainerStyle={{ paddingBottom: theme.spacing.lg }}
          ListHeaderComponent={
            <View style={styles.resultTypeHeader}>
              <Text style={styles.resultTypeText}>
                {results.length} résultat{results.length > 1 ? 's' : ''}
              </Text>
            </View>
          }
        />
      );
    }

    // Afficher les recherches récentes si aucune recherche active
    return (
      <ScrollView style={styles.recentSearchesContainer}>
        <Text style={styles.sectionTitle}>Recherches récentes</Text>
        
        {recentSearches.map((search, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.recentSearchItem}
            onPress={() => {
              setSearchQuery(search);
              performSearch(search);
            }}
          >
            <Ionicons name="time-outline" size={22} color={theme.colors.placeholder} />
            <Text style={styles.recentSearchText}>{search}</Text>
            <Ionicons name="chevron-forward" size={22} color={theme.colors.placeholder} />
          </TouchableOpacity>
        ))}
        
        <Divider style={{ marginVertical: theme.spacing.lg }} />
        
        <Text style={styles.sectionTitle}>Explorez par catégorie</Text>
        
        <View style={styles.filterContainer}>
          <Chip 
            style={styles.chip} 
            mode="outlined"
            onPress={() => navigation.navigate('DiagnosticsTabs')}
          >
            Diagnostics
          </Chip>
          <Chip 
            style={styles.chip} 
            mode="outlined"
            onPress={() => {}}
          >
            Articles
          </Chip>
          <Chip 
            style={styles.chip} 
            mode="outlined"
            onPress={() => {}}
          >
            Ressources
          </Chip>
          <Chip 
            style={styles.chip} 
            mode="outlined"
            onPress={() => {}}
          >
            Tutoriels
          </Chip>
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Rechercher..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          onSubmitEditing={onSubmitSearch}
          onClearIconPress={clearSearch}
          style={styles.searchbar}
        />
      </View>
      
      {searchQuery && (
        <View style={styles.filterContainer}>
          <Chip 
            style={styles.chip} 
            selected={activeFilter === 'all'}
            onPress={() => setActiveFilter('all')}
            mode="outlined"
          >
            Tous
          </Chip>
          <Chip 
            style={styles.chip} 
            selected={activeFilter === 'content'}
            onPress={() => setActiveFilter('content')}
            mode="outlined"
          >
            Contenus
          </Chip>
          <Chip 
            style={styles.chip} 
            selected={activeFilter === 'diagnostic'}
            onPress={() => setActiveFilter('diagnostic')}
            mode="outlined"
          >
            Diagnostics
          </Chip>
        </View>
      )}
      
      <View style={styles.resultsContainer}>
        {renderContent()}
      </View>
    </View>
  );
};

export default SearchScreen;
