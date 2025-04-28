import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Card, Text, IconButton, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import useResponsive from '../hooks/useResponsive';
import { deleteDiagnostic, fetchRecentDiagnostics } from '../store/diagnosticSlice';

const DiagnosticCard = ({ diagnostic }) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isMobile } = useResponsive();
  
  const handlePress = () => {
    navigation.navigate('DiagnosticDetail', { 
      id: diagnostic.id,
      title: diagnostic.title
    });
  };

  const handleDelete = (e) => {
    // Empêcher la propagation au Card
    if (e) {
      e.stopPropagation();
    }
    
    console.log("========= BOUTON SUPPRIMER CLIQUÉ =========");
    console.log("Diagnostic ID:", diagnostic.id);
    console.log("Type de l'ID:", typeof diagnostic.id);
    
    // Tentative directe de suppression sans Alert pour déboguer
    console.log("========= TENTATIVE DIRECTE DE SUPPRESSION =========");
    
    dispatch(deleteDiagnostic(diagnostic.id))
      .unwrap()
      .then(() => {
        console.log("========= SUPPRESSION RÉUSSIE =========");
        console.log("Le diagnostic a été supprimé avec succès");
        // Rafraîchir la liste après suppression
        dispatch(fetchRecentDiagnostics());
      })
      .catch(error => {
        console.error("========= ERREUR DE SUPPRESSION DIRECTE =========");
        console.error("Détails de l'erreur:", error);
        console.error("Message d'erreur:", error.message);
      });
    
    // Commentaire temporaire de l'Alert pour tester la suppression directe
    /*
    Alert.alert(
      "Supprimer ce diagnostic",
      "Êtes-vous sûr de vouloir supprimer ce diagnostic de stress ?",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Supprimer", 
          style: "destructive",
          onPress: () => {
            console.log("========= CONFIRMATION DE SUPPRESSION =========");
            console.log("Tentative de suppression de l'ID:", diagnostic.id);
            
            dispatch(deleteDiagnostic(diagnostic.id))
              .unwrap()
              .then(() => {
                console.log("========= SUPPRESSION RÉUSSIE =========");
                console.log("Le diagnostic a été supprimé avec succès");
                // Rafraîchir la liste après suppression
                dispatch(fetchRecentDiagnostics());
              })
              .catch(error => {
                console.error("========= ERREUR DE SUPPRESSION =========");
                console.error("Détails de l'erreur:", error);
                console.error("Message d'erreur:", error.message);
                Alert.alert("Erreur", "Impossible de supprimer ce diagnostic: " + (error.message || "Erreur inconnue"));
              });
          }
        }
      ]
    );
    */
  };

  // Style adaptatif basé sur la plateforme
  const styles = StyleSheet.create({
    card: {
      marginVertical: theme.spacing.sm,
      marginHorizontal: isMobile ? theme.spacing.sm : theme.spacing.lg,
      borderRadius: theme.borderRadius.medium,
      overflow: 'hidden',
    },
    content: {
      padding: theme.spacing.md,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    title: {
      fontSize: theme.fontSize.title,
      fontWeight: 'bold',
      flex: 1,
      color: theme.colors.text,
    },
    score: {
      backgroundColor: getScoreColor(diagnostic.score),
      borderRadius: 50,
      paddingVertical: 6,
      paddingHorizontal: 12,
      marginLeft: theme.spacing.sm,
    },
    scoreText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize: theme.fontSize.body,
    },
    date: {
      fontSize: theme.fontSize.caption,
      color: theme.colors.placeholder,
      marginBottom: theme.spacing.sm,
    },
    stressLevel: {
      fontSize: theme.fontSize.body,
      fontWeight: 'bold',
      color: getScoreColor(diagnostic.score),
      marginVertical: theme.spacing.sm,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginTop: theme.spacing.xs,
    },
    deleteButton: {
      backgroundColor: '#ffeaea',
      borderRadius: 20,
    }
  });

  // Fonction pour déterminer la couleur selon le score
  function getScoreColor(score) {
    if (score < 150) return '#10B981'; // Faible risque - vert
    if (score < 300) return '#F59E0B'; // Risque modéré - orange
    return '#EF4444'; // Risque élevé - rouge
  }

  // Fonction pour obtenir le niveau de stress
  function getStressLevel(score) {
    if (score < 150) return "Faible risque de stress";
    if (score < 300) return "Risque modéré de stress";
    return "Risque élevé de stress";
  }

  // Format de date adapté au mobile (plus compact)
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  return (
    <Card style={styles.card} onPress={handlePress} testID="diagnostic-card">
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {diagnostic.title}
          </Text>
          <View style={styles.score} testID="diagnostic-score">
            <Text style={styles.scoreText}>{diagnostic.score}</Text>
          </View>
        </View>
        
        <Text style={styles.date}>
          {formatDate(diagnostic.completedAt)}
        </Text>
        
        <Text style={styles.stressLevel} testID="diagnostic-stress-level">
          {getStressLevel(diagnostic.score)}
        </Text>
        
        <View style={styles.footer}>
          <TouchableOpacity onPress={(e) => handleDelete(e)}>
            <IconButton
              icon="delete"
              iconColor="#FF5252"
              size={20}
              style={styles.deleteButton}
              testID="delete-diagnostic-button"
            />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

export default DiagnosticCard;
