import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Card, Button, useTheme, Divider, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import apiClient from '../api/apiClient';
import ContentCard from '../components/ContentCard';

const GuestContentScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [publicContents, setPublicContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchPublicContents = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/content/public');
      setPublicContents(response.data.contents || []);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des contenus publics:', err);
      setError("Impossible de charger les articles pour le moment.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPublicContents();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPublicContents();
  };

  const handleContentPress = (content) => {
    navigation.navigate('GuestContentDetail', { 
      id: content.id,
      title: content.title
    });
  };

  const renderItem = ({ item }) => (
    <ContentCard 
      content={item}
      onPress={() => handleContentPress(item)}
      isGuest={true}
    />
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    headerSection: {
      padding: 16,
      backgroundColor: theme.colors.surface,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    headerSubtitle: {
      fontSize: 16,
      color: theme.colors.placeholder,
      marginBottom: 16,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    errorContainer: {
      padding: 20,
      alignItems: 'center',
    },
    errorText: {
      color: theme.colors.error,
      marginBottom: 10,
      textAlign: 'center',
    },
    emptyContainer: {
      padding: 20,
      alignItems: 'center',
    },
    emptyText: {
      color: theme.colors.placeholder,
      marginBottom: 10,
      textAlign: 'center',
    },
    listContainer: {
      padding: 16,
    }
  });

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text>Chargement des articles...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Articles publics</Text>
        <Text style={styles.headerSubtitle}>
          Découvrez des articles et des conseils pour gérer votre stress et améliorer votre bien-être.
        </Text>
      </View>

      <Divider />

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button mode="contained" onPress={fetchPublicContents}>
            Réessayer
          </Button>
        </View>
      ) : publicContents.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucun article disponible pour le moment.</Text>
        </View>
      ) : (
        <FlatList
          data={publicContents}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
            />
          }
        />
      )}
    </View>
  );
};

export default GuestContentScreen;