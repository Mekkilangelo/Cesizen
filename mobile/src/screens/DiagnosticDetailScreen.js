import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Share, Alert } from 'react-native';
import { Text, Card, Button, Divider, useTheme, ProgressBar, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDiagnosticById, deleteDiagnostic } from '../store/diagnosticSlice';
import useResponsive from '../hooks/useResponsive';
import { CommonActions } from '@react-navigation/native';

const DiagnosticDetailScreen = ({ route, navigation }) => {
  const { id } = route.params || {};
  const dispatch = useDispatch();
  const theme = useTheme();
  const { isMobile } = useResponsive();
  const { currentDiagnostic, isLoading } = useSelector(state => state.diagnostics);
  
  // Définition des styles au début
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      padding: isMobile ? 16 : 24,
      paddingBottom: 32,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 24,
    },
    headerContent: {
      flex: 1,
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
      elevation: 2,
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
    },
    stressLevel: {
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 8,
    },
    recommendationsCard: {
      marginVertical: 16,
      padding: 16,
      borderRadius: 8,
      elevation: 2,
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
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginVertical: 16,
    },
    buttonContainer: {
      flex: 1,
      marginHorizontal: 4,
    },
    eventsContainer: {
      marginVertical: 16,
      elevation: 2,
      borderRadius: 8,
    },
    eventItem: {
      flexDirection: 'row',
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#F3F4F6',
    },
    eventText: {
      flex: 1,
      fontSize: 14,
    },
    deleteButtonContainer: {
      marginTop: 24,
      marginBottom: 16,
    },
    deleteButton: {
      height: 50,
      backgroundColor: '#FF5252',
      borderRadius: 8,
    },
    actionButton: {
      borderRadius: 8,
      height: 48,
    },
  });
  
  useEffect(() => {
    if (id) {
      dispatch(fetchDiagnosticById(id));
    }
  }, [id, dispatch]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score) => {
    if (score < 150) return '#10B981'; // Faible risque - vert
    if (score < 300) return '#F59E0B'; // Risque modéré - orange
    return '#EF4444'; // Risque élevé - rouge
  };

  const getStressLevelText = (score) => {
    if (score < 150) return "Faible risque de stress";
    if (score < 300) return "Risque modéré de stress";
    return "Risque élevé de stress";
  };

  const handleShare = async () => {
    if (!currentDiagnostic) return;
    
    try {
      const result = await Share.share({
        message: `Mon score sur l'échelle de stress Holmes-Rahe est de ${currentDiagnostic.score} points (${getStressLevelText(currentDiagnostic.score)}).`,
        title: 'Résultat du test de stress',
      });
    } catch (error) {
      console.error("Erreur lors du partage:", error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Supprimer ce diagnostic",
      "Êtes-vous sûr de vouloir supprimer ce diagnostic de stress ? Cette action est irréversible.",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Supprimer", 
          style: "destructive",
          onPress: () => {
            if (currentDiagnostic && currentDiagnostic.id) {
              dispatch(deleteDiagnostic(currentDiagnostic.id))
                .unwrap()
                .then(() => {
                  // Utiliser une navigation plus explicite qui fonctionne mieux sur le web
                  navigation.reset({
                    index: 0,
                    routes: [
                      { 
                        name: 'Main',
                        state: {
                          routes: [
                            {
                              name: 'Diagnostic'
                            }
                          ]
                        }
                      }
                    ],
                  });
                })
                .catch(error => {
                  Alert.alert(
                    "Erreur", 
                    "Impossible de supprimer ce diagnostic: " + (error.message || "Erreur inconnue")
                  );
                });
            }
          }
        }
      ]
    );
  };

  if (isLoading || !currentDiagnostic) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Chargement des résultats...</Text>
      </View>
    );
  }

  // Événements Holmes-Rahe avec leur score pour référence
  const holmesRaheEvents = [
    { id: 1, event: "Décès d'un conjoint", score: 100 },
    { id: 2, event: "Divorce", score: 73 },
    { id: 3, event: "Séparation conjugale", score: 65 },
    { id: 4, event: "Emprisonnement", score: 63 },
    { id: 5, event: "Décès d'un proche parent", score: 63 },
    { id: 6, event: "Blessure ou maladie personnelle", score: 53 },
    { id: 7, event: "Mariage", score: 50 },
    { id: 8, event: "Licenciement", score: 47 },
    { id: 9, event: "Réconciliation conjugale", score: 45 },
    { id: 10, event: "Retraite", score: 45 },
    { id: 11, event: "Changement dans la santé d'un membre de la famille", score: 44 },
    { id: 12, event: "Grossesse", score: 40 },
    { id: 13, event: "Difficultés sexuelles", score: 39 },
    { id: 14, event: "Arrivée d'un nouveau membre dans la famille", score: 39 },
    { id: 15, event: "Réajustement professionnel", score: 39 },
    { id: 16, event: "Changement de situation financière", score: 38 },
    { id: 17, event: "Décès d'un ami proche", score: 37 },
    { id: 18, event: "Changement de métier", score: 36 },
    { id: 19, event: "Changement dans les disputes avec le conjoint", score: 35 },
    { id: 20, event: "Prêt ou hypothèque important", score: 31 },
    { id: 21, event: "Saisie d'hypothèque ou de prêt", score: 30 },
    { id: 22, event: "Changement de responsabilités au travail", score: 29 },
    { id: 23, event: "Départ d'un enfant du foyer", score: 29 },
    { id: 24, event: "Problèmes avec la belle-famille", score: 29 },
    { id: 25, event: "Réussite personnelle exceptionnelle", score: 28 },
    { id: 26, event: "Conjoint commençant ou arrêtant de travailler", score: 26 },
    { id: 27, event: "Début ou fin d'études", score: 26 },
    { id: 28, event: "Changement de conditions de vie", score: 25 },
    { id: 29, event: "Révision des habitudes personnelles", score: 24 },
    { id: 30, event: "Difficultés avec un supérieur", score: 23 },
    { id: 31, event: "Changement d'horaires ou de conditions de travail", score: 20 },
    { id: 32, event: "Déménagement", score: 20 },
    { id: 33, event: "Changement d'école", score: 20 },
    { id: 34, event: "Changement de loisirs", score: 19 },
    { id: 35, event: "Changement d'activités religieuses", score: 19 },
    { id: 36, event: "Changement d'activités sociales", score: 18 },
    { id: 37, event: "Prêt ou hypothèque modéré", score: 17 },
    { id: 38, event: "Changement dans les habitudes de sommeil", score: 16 },
    { id: 39, event: "Changement dans les réunions familiales", score: 15 },
    { id: 40, event: "Changement dans les habitudes alimentaires", score: 15 },
    { id: 41, event: "Vacances", score: 13 },
    { id: 42, event: "Noël", score: 12 },
    { id: 43, event: "Infractions mineures à la loi", score: 11 }
  ];

  // Récupérer les événements sélectionnés
  const selectedEvents = currentDiagnostic.responses ? 
    Object.entries(currentDiagnostic.responses)
      .filter(([key, value]) => value === 1 || value === true)
      .map(([key]) => holmesRaheEvents.find(e => e.id === parseInt(key)))
      .filter(event => event !== undefined) : [];
  
  // On récupère la couleur après avoir vérifié que currentDiagnostic existe
  const scoreColor = getScoreColor(currentDiagnostic.score);

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{currentDiagnostic.title}</Text>
          <View style={styles.metadata}>
            <Text style={styles.metaItem}>
              Date: {formatDate(currentDiagnostic.completedAt)}
            </Text>
          </View>
        </View>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
      </View>

      <Card style={styles.scoreCard} elevation={2}>
        <Card.Content>
          <View style={styles.scoreHeader}>
            <Text style={styles.scoreTitle}>Score de stress Holmes-Rahe</Text>
            <Text style={[styles.scoreValue, { color: scoreColor }]}>{currentDiagnostic.score}</Text>
          </View>
          <ProgressBar
            progress={Math.min(currentDiagnostic.score / 400, 1)}
            color={scoreColor}
            style={{ height: 10, borderRadius: 5 }}
          />
          <Text style={[styles.stressLevel, { color: scoreColor }]}>
            {getStressLevelText(currentDiagnostic.score)}
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.recommendationsCard} elevation={2}>
        <Card.Content>
          <Text style={styles.recommendationsTitle}>Recommandations</Text>
          <Text style={styles.recommendationsText}>
            {currentDiagnostic.recommendations || "Aucune recommandation disponible."}
          </Text>
        </Card.Content>
      </Card>

      <Divider style={styles.divider} />

      <Card style={styles.eventsContainer}>
        <Card.Content>
          <Text style={styles.recommendationsTitle}>
            Événements de vie vécus (12 derniers mois)
          </Text>
          {selectedEvents.length > 0 ? (
            selectedEvents.map(event => (
              <View key={event.id} style={styles.eventItem}>
                <Text style={styles.eventText}>{event.event}</Text>
                <Text style={{ color: scoreColor, fontWeight: 'bold' }}>{event.score}</Text>
              </View>
            ))
          ) : (
            <Text>Aucun événement sélectionné.</Text>
          )}
        </Card.Content>
      </Card>

      <View style={styles.actionsContainer}>
        <Button 
          mode="contained" 
          icon="share-variant"
          style={[styles.buttonContainer, styles.actionButton]}
          onPress={handleShare}
        >
          Partager
        </Button>
        <Button 
          mode="outlined" 
          icon="refresh"
          style={[styles.buttonContainer, styles.actionButton]}
          onPress={() => navigation.navigate('HolmesRaheDiagnostic')}
        >
          Refaire le test
        </Button>
      </View>
      
      <View style={styles.deleteButtonContainer}>
        <Button 
          mode="contained" 
          icon="delete"
          buttonColor="#FF5252"
          textColor="white"
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          Supprimer ce diagnostic
        </Button>
      </View>
    </ScrollView>
  );
};

export default DiagnosticDetailScreen;
