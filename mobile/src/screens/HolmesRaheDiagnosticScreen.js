import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Checkbox, Button, Card, useTheme, ProgressBar } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { createDiagnostic } from '../store/diagnosticSlice';
import useResponsive from '../hooks/useResponsive';

const HolmesRaheDiagnosticScreen = ({ navigation }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { isMobile } = useResponsive();
  const [selectedEvents, setSelectedEvents] = useState({});
  const [totalScore, setTotalScore] = useState(0);
  const [title, setTitle] = useState(`Diagnostic de stress (${new Date().toLocaleDateString()})`);
  
  // Holmes and Rahe life events with their scores
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

  // Calculate total score when selected events change
  useEffect(() => {
    let score = 0;
    Object.keys(selectedEvents).forEach(id => {
      if (selectedEvents[id]) {
        const event = holmesRaheEvents.find(e => e.id === parseInt(id));
        if (event) score += event.score;
      }
    });
    setTotalScore(score);
  }, [selectedEvents]);

  const handleToggleEvent = (id) => {
    setSelectedEvents(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getScoreColor = (score) => {
    if (score < 150) return '#10B981'; // Low risk - green
    if (score < 300) return '#F59E0B'; // Moderate risk - amber
    return '#EF4444'; // High risk - red
  };

  const getStressLevel = (score) => {
    if (score < 150) return "Faible risque de stress";
    if (score < 300) return "Risque modéré de stress";
    return "Risque élevé de stress";
  };

  const handleSubmit = () => {
    // Format responses for backend
    const responses = {};
    holmesRaheEvents.forEach(event => {
      responses[event.id] = selectedEvents[event.id] ? 1 : 0;
    });

    // Calculate normalized score
    const normScore = totalScore;

    dispatch(createDiagnostic({
      title,
      responses,
      isPublic: false,
      rawScore: totalScore,
      isHolmesRahe: true
    }))
    .unwrap()
    .then(() => {
      Alert.alert(
        "Diagnostic complété",
        `Votre score de stress Holmes-Rahe est de ${totalScore} points.`,
        [{ 
          text: "OK", 
          onPress: () => {
            // Réinitialiser le formulaire
            setSelectedEvents({});
            setTotalScore(0);
            setTitle(`Diagnostic de stress (${new Date().toLocaleDateString()})`);
            
            // Navigation robuste qui fonctionne en mode web
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
          }
        }]
      );
    })
    .catch(error => {
      Alert.alert("Erreur", error.message || "Impossible de sauvegarder le diagnostic");
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      padding: isMobile ? theme.spacing.md : theme.spacing.lg,
    },
    header: {
      marginBottom: theme.spacing.md,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: 8,
    },
    description: {
      fontSize: 16,
      marginBottom: 16,
      lineHeight: 24,
    },
    eventsContainer: {
      marginBottom: 20,
    },
    eventItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#F3F4F6',
    },
    eventText: {
      flex: 1,
      fontSize: 16,
      marginLeft: 8,
    },
    eventScore: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginLeft: 8,
      minWidth: 40,
      textAlign: 'right',
    },
    scoreCard: {
      marginTop: 20,
      marginBottom: 20,
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
      fontSize: 18,
      fontWeight: 'bold',
    },
    scoreValue: {
      fontSize: 32,
      fontWeight: 'bold',
      color: getScoreColor(totalScore),
    },
    stressLevel: {
      fontSize: 16,
      marginTop: 8,
      color: getScoreColor(totalScore),
    },
    submitButton: {
      marginTop: 20,
      padding: 8,
    },
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Échelle de stress de Holmes et Rahe</Text>
        <Text style={styles.description}>
          Cette échelle mesure le niveau de stress en fonction des événements de vie survenus au cours des 12 derniers mois. 
          Sélectionnez tous les événements que vous avez vécus.
        </Text>
      </View>

      <Card style={styles.scoreCard}>
        <Card.Content>
          <View style={styles.scoreHeader}>
            <Text style={styles.scoreTitle}>Score total</Text>
            <Text style={styles.scoreValue}>{totalScore}</Text>
          </View>
          <ProgressBar
            progress={Math.min(totalScore / 400, 1)} // 400 as a reasonable max
            color={getScoreColor(totalScore)}
            style={{ height: 10, borderRadius: 5 }}
          />
          <Text style={styles.stressLevel}>{getStressLevel(totalScore)}</Text>
        </Card.Content>
      </Card>

      <View style={styles.eventsContainer}>
        {holmesRaheEvents.map(event => (
          <View key={event.id} style={styles.eventItem}>
            <Checkbox
              status={selectedEvents[event.id] ? 'checked' : 'unchecked'}
              onPress={() => handleToggleEvent(event.id)}
            />
            <Text style={styles.eventText}>{event.event}</Text>
            <Text style={styles.eventScore}>{event.score}</Text>
          </View>
        ))}
      </View>

      <Button
        mode="contained"
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        Compléter le diagnostic
      </Button>
    </ScrollView>
  );
};

export default HolmesRaheDiagnosticScreen;