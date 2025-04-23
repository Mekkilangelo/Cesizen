import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, FAB, Searchbar, useTheme, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { fetchRecentDiagnostics } from '../store/diagnosticSlice';
import DiagnosticCard from '../components/DiagnosticCard';
import useResponsive from '../hooks/useResponsive';

const DiagnosticScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { latestDiagnostics, isLoading } = useSelector(state => state.diagnostics);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const theme = useTheme();
  const { isMobile } = useResponsive();

  useEffect(() => {
    loadDiagnostics();
  }, []);

  const loadDiagnostics = () => {
    dispatch(fetchRecentDiagnostics());
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDiagnostics();
    setRefreshing(false);
  };

  const handleNewDiagnostic = () => {
    // Navigation vers l'écran de création de diagnostic
    // navigation.navigate('CreateDiagnostic');
    alert('Navigation vers la création de diagnostic');
  };

  const handleFavorite = (id) => {
    // Logique pour marquer un diagnostic comme favori
    alert(`Favoriser le diagnostic ${id}`);
  };

  const handleShare = (id) => {
    // Logique pour partager un diagnostic
    alert(`Partager le diagnostic ${id}`);
  };

  const filteredDiagnostics = searchQuery
    ? latestDiagnostics.filter(diag => 
        diag.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : latestDiagnostics;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    searchContainer: {
      padding: theme.spacing.md,
    },
    searchbar: {
      elevation: 0,
      backgroundColor: '#F3F4F6',
      borderRadius: theme.borderRadius.medium,
    },
    listContainer: {
      flexGrow: 1,
      padding: isMobile ? theme.spacing.xs : theme.spacing.md,
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
      marginBottom: theme.spacing.lg,
    },
    subText: {
      fontSize: theme.fontSize.body,
      color: theme.colors.placeholder,
      textAlign: 'center',
      marginBottom: theme.spacing.xl,
    },
    fab: {
      position: 'absolute',
      margin: theme.spacing.lg,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.primary,
    },
  });

  // Simulons des données pour le développement
  const mockDiagnostics = latestDiagnostics.length > 0 ? latestDiagnostics : [
    {
      id: 1,
      title: 'Diagnostic Entreprise 2023',
      score: 75,
      completedAt: new Date().toISOString(),
      recommendations: 'Votre entreprise performe bien, mais il y a des améliorations possibles...',
      isPublic: true,
      isFavorite: true,
    },
    {
      id: 2,
      title: 'Audit Sécurité',
      score: 45,
      completedAt: new Date(Date.now() - 86400000).toISOString(),
      recommendations: 'Des mesures urgentes sont nécessaires pour améliorer la sécurité...',
      isPublic: false,
      isFavorite: false,
    }
  ];

  const renderItem = ({ item }) => (
    <DiagnosticCard 
      diagnostic={item} 
      onFavorite={handleFavorite}
      onShare={handleShare}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Rechercher un diagnostic..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          iconColor={theme.colors.placeholder}
        />
      </View>

      <FlatList
        data={mockDiagnostics}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun diagnostic</Text>
            <Text style={styles.subText}>
              Créez votre premier diagnostic pour évaluer votre entreprise
            </Text>
            <Button 
              mode="contained" 
              onPress={handleNewDiagnostic}
            >
              Créer un diagnostic
            </Button>
          </View>
        }
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleNewDiagnostic}
      />
    </View>
  );
};

export default DiagnosticScreen;
