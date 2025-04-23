import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, FAB, Searchbar, useTheme, Button, Card } from 'react-native-paper';
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
    navigation.navigate('HolmesRaheDiagnostic');
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
      marginTop: 60,
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
    infoCard: {
      margin: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    infoCardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    infoCardContent: {
      fontSize: 14,
      lineHeight: 20,
    },
    fab: {
      position: 'absolute',
      margin: theme.spacing.lg,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.primary,
    },
    actionButton: {
      marginVertical: theme.spacing.md,
      marginHorizontal: theme.spacing.md,
    },
  });

  const renderItem = ({ item }) => (
    <DiagnosticCard diagnostic={item} />
  );

  return (
    <View style={styles.container}>
      <Card style={styles.infoCard}>
        <Card.Content>
          <Text style={styles.infoCardTitle}>Échelle de stress de Holmes et Rahe</Text>
          <Text style={styles.infoCardContent}>
            Cette échelle évalue votre niveau de stress en fonction des événements majeurs survenus dans votre vie au cours des 12 derniers mois. 
            Plus votre score est élevé, plus votre risque de problèmes de santé liés au stress est important.
          </Text>
        </Card.Content>
      </Card>

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
        data={filteredDiagnostics}
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
              Créez votre premier test de stress pour évaluer votre niveau de stress 
            </Text>
          </View>
        }
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleNewDiagnostic}
        label="Nouveau test"
      />
    </View>
  );
};

export default DiagnosticScreen;
