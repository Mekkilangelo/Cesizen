import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, FlatList } from 'react-native';
import { Text, Button, Card, Title, useTheme, Divider, FAB } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DiagnosticCard from '../components/DiagnosticCard';
import ContentCard from '../components/ContentCard';
import useResponsive from '../hooks/useResponsive';
import { fetchRecentDiagnostics } from '../store/diagnosticSlice';
import { fetchLatestContent } from '../store/contentSlice';

const HomeScreen = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { isMobile } = useResponsive();
  const [refreshing, setRefreshing] = useState(false);
  
  // Sélecteurs Redux
  const { latestDiagnostics, isLoading: diagLoading } = useSelector(state => state.diagnostics);
  const { latestContent, isLoading: contentLoading } = useSelector(state => state.contents);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    dispatch(fetchRecentDiagnostics());
    dispatch(fetchLatestContent());
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
    setRefreshing(false);
  };

  const handleNewDiagnostic = () => {
    navigation.navigate('DiagnosticsTabs');
  };

  const handleFavorite = (id) => {
    // Logique de gestion des favoris
  };

  const handleShare = (id) => {
    // Logique de partage
  };

  // Styles avec priorité mobile
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
    },
    header: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
      backgroundColor: theme.colors.primary,
    },
    welcomeText: {
      fontSize: theme.fontSize.heading,
      color: 'white',
      fontWeight: 'bold',
    },
    subHeader: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: theme.fontSize.body,
      marginTop: theme.spacing.xs,
    },
    section: {
      marginVertical: theme.spacing.md,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    sectionTitle: {
      fontSize: theme.fontSize.title,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    viewAllText: {
      color: theme.colors.primary,
      fontSize: theme.fontSize.body,
    },
    emptyState: {
      padding: theme.spacing.lg,
      alignItems: 'center',
    },
    emptyStateText: {
      textAlign: 'center',
      color: theme.colors.placeholder,
      marginBottom: theme.spacing.md,
    },
    fabContainer: {
      position: 'absolute',
      right: theme.spacing.lg,
      bottom: theme.spacing.lg,
    },
    fab: {
      backgroundColor: theme.colors.primary,
    },
    searchBar: {
      marginHorizontal: theme.spacing.md,
      marginVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.medium,
      height: 48,
      overflow: 'hidden',
      backgroundColor: 'white',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    searchBarText: {
      color: theme.colors.placeholder,
      marginLeft: theme.spacing.sm,
      flex: 1,
    },
    quickActions: {
      flexDirection: 'row',
      paddingHorizontal: theme.spacing.md,
      marginTop: -theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    actionCard: {
      flex: 1,
      margin: theme.spacing.xs,
      borderRadius: theme.borderRadius.medium,
      padding: theme.spacing.md,
      backgroundColor: 'white',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 1,
    },
    actionIcon: {
      backgroundColor: '#E0F2F1',
      padding: theme.spacing.md,
      borderRadius: 50,
      marginBottom: theme.spacing.sm,
    },
    actionText: {
      fontSize: theme.fontSize.caption,
      textAlign: 'center',
    },
    horizontalList: {
      paddingHorizontal: theme.spacing.md - theme.spacing.xs,
    }
  });

  // Interface optimisée pour mobile
  if (isMobile) {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* En-tête personnalisé pour mobile */}
          <View style={styles.header}>
            <Text style={styles.welcomeText}>
              Bonjour, {user?.username || 'utilisateur'}
            </Text>
            <Text style={styles.subHeader}>
              Que souhaitez-vous faire aujourd'hui ?
            </Text>
          </View>

          {/* Barre de recherche tactile pour mobile */}
          <TouchableOpacity
            style={styles.searchBar}
            onPress={() => navigation.navigate('SearchTabs')}
          >
            <Ionicons name="search" size={22} color={theme.colors.placeholder} />
            <Text style={styles.searchBarText}>Rechercher...</Text>
          </TouchableOpacity>

          {/* Actions rapides en format grille - spécifique mobile */}
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={handleNewDiagnostic}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="add-circle" size={24} color={theme.colors.primary} />
              </View>
              <Text style={styles.actionText}>Nouveau diagnostic</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('DiagnosticsTabs')}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="analytics" size={24} color={theme.colors.primary} />
              </View>
              <Text style={styles.actionText}>Mes diagnostics</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('ContentDetail', { filter: 'favorites' })}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="heart" size={24} color={theme.colors.primary} />
              </View>
              <Text style={styles.actionText}>Favoris</Text>
            </TouchableOpacity>
          </View>

          {/* Derniers diagnostics - format liste horizontale */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Mes diagnostics récents</Text>
              <TouchableOpacity onPress={() => navigation.navigate('DiagnosticsTabs')}>
                <Text style={styles.viewAllText}>Voir tout</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              horizontal
              data={latestDiagnostics}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <View style={{ width: 280, marginRight: theme.spacing.sm }}>
                  <DiagnosticCard 
                    diagnostic={item} 
                    onFavorite={handleFavorite}
                    onShare={handleShare}
                  />
                </View>
              )}
              contentContainerStyle={styles.horizontalList}
              showsHorizontalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>
                    Vous n'avez pas encore de diagnostic.
                  </Text>
                  <Button mode="contained" onPress={handleNewDiagnostic}>
                    Créer mon premier diagnostic
                  </Button>
                </View>
              }
            />
          </View>

          <Divider />

          {/* Contenus recommandés */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Contenus pour vous</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>Voir tout</Text>
              </TouchableOpacity>
            </View>

            {latestContent.map(content => (
              <ContentCard key={content.id} content={content} />
            ))}

            {latestContent.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  Aucun contenu disponible pour le moment.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
        
        {/* Bouton flottant pour nouvelle action - pattern mobile */}
        <View style={styles.fabContainer}>
          <FAB
            style={styles.fab}
            icon="plus"
            onPress={handleNewDiagnostic}
          />
        </View>
      </View>
    );
  }
  
  // Version desktop (plus sobre, différente de la version mobile)
  return (
    <View style={styles.container}>
      {/* Interface desktop simplifiée */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Contenu desktop */}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
