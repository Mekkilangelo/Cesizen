import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Text, Card, Button, DataTable, useTheme, Searchbar, FAB, Chip } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import apiClient from '../../api/apiClient';

const AdminDashboardScreen = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    users: { total: 0, active: 0 },
    diagnostics: { total: 0, public: 0 },
    contents: { total: 0, public: 0 },
    comments: { total: 0, moderated: 0 }
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchRecentActivity();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/admin/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await apiClient.get('/admin/activity');
      setRecentActivity(response.data.activities);
    } catch (error) {
      console.error('Erreur lors de la récupération des activités récentes:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchStats(), fetchRecentActivity()]);
    setRefreshing(false);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background,
    },
    welcomeCard: {
      marginBottom: theme.spacing.md,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    statsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
    },
    statCard: {
      width: '48%',
      marginBottom: theme.spacing.sm,
    },
    statValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 14,
      color: theme.colors.placeholder,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginVertical: theme.spacing.md,
    },
    activityCard: {
      marginBottom: theme.spacing.sm,
    },
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
    },
    chipContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginVertical: 10,
    },
    chip: {
      marginRight: 8,
      marginBottom: 8,
    },
    searchbar: {
      marginBottom: theme.spacing.md,
      backgroundColor: '#F3F4F6',
    },
    table: {
      backgroundColor: theme.colors.surface,
      marginBottom: theme.spacing.md,
    },
    tableCell: {
      paddingHorizontal: 8,
    },
  });

  const getActivityIcon = (type) => {
    switch (type) {
      case 'diagnostic': return 'heart-pulse';
      case 'content': return 'file-document';
      case 'comment': return 'comment';
      case 'user': return 'account';
      default: return 'information';
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Card style={styles.welcomeCard}>
        <Card.Content>
          <Text style={styles.cardTitle}>Bienvenue, {user.username}</Text>
          <Text>Voici le tableau de bord administrateur de Cesizen. Vous pouvez gérer les utilisateurs, les contenus, les diagnostics et les commentaires.</Text>
        </Card.Content>
      </Card>

      <Searchbar
        placeholder="Rechercher..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <View style={styles.chipContainer}>
        <Chip 
          style={styles.chip} 
          icon="account-group" 
          onPress={() => {/* Naviguer vers la gestion des utilisateurs */}}
        >
          Utilisateurs
        </Chip>
        <Chip 
          style={styles.chip} 
          icon="file-document" 
          onPress={() => {/* Naviguer vers la gestion des contenus */}}
        >
          Contenus
        </Chip>
        <Chip 
          style={styles.chip} 
          icon="heart-pulse" 
          onPress={() => {/* Naviguer vers la gestion des diagnostics */}}
        >
          Diagnostics
        </Chip>
        <Chip 
          style={styles.chip} 
          icon="comment" 
          onPress={() => {/* Naviguer vers la gestion des commentaires */}}
        >
          Commentaires
        </Chip>
      </View>

      <Text style={styles.sectionTitle}>Statistiques</Text>
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statValue}>{stats.users.total}</Text>
            <Text style={styles.statLabel}>Utilisateurs au total</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statValue}>{stats.diagnostics.total}</Text>
            <Text style={styles.statLabel}>Diagnostics au total</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statValue}>{stats.contents.total}</Text>
            <Text style={styles.statLabel}>Contenus au total</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statValue}>{stats.comments.total}</Text>
            <Text style={styles.statLabel}>Commentaires au total</Text>
          </Card.Content>
        </Card>
      </View>

      <Text style={styles.sectionTitle}>Activité récente</Text>
      <DataTable style={styles.table}>
        <DataTable.Header>
          <DataTable.Title style={styles.tableCell}>Type</DataTable.Title>
          <DataTable.Title style={styles.tableCell}>Utilisateur</DataTable.Title>
          <DataTable.Title style={styles.tableCell}>Action</DataTable.Title>
          <DataTable.Title style={styles.tableCell}>Date</DataTable.Title>
        </DataTable.Header>

        {recentActivity.length === 0 ? (
          <DataTable.Row>
            <DataTable.Cell>Aucune activité récente</DataTable.Cell>
          </DataTable.Row>
        ) : (
          recentActivity.slice(0, 5).map((activity, index) => (
            <DataTable.Row key={index}>
              <DataTable.Cell style={styles.tableCell}>{activity.type}</DataTable.Cell>
              <DataTable.Cell style={styles.tableCell}>{activity.user}</DataTable.Cell>
              <DataTable.Cell style={styles.tableCell}>{activity.action}</DataTable.Cell>
              <DataTable.Cell style={styles.tableCell}>{new Date(activity.date).toLocaleDateString()}</DataTable.Cell>
            </DataTable.Row>
          ))
        )}
      </DataTable>

      <Button 
        mode="contained" 
        onPress={() => {/* Naviguer vers toutes les activités */}}
        style={{ marginBottom: 20 }}
      >
        Voir toutes les activités
      </Button>

      <FAB
        style={styles.fab}
        icon="cog"
        onPress={() => {/* Naviguer vers les paramètres d'administration */}}
      />
    </ScrollView>
  );
};

export default AdminDashboardScreen;