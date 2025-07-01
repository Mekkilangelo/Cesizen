import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card, Title, Paragraph, Divider } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

const TicketScreen = ({ navigation }) => {
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setIsSubmitting(true);
    
    // Simuler l'envoi du ticket
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Ticket créé',
        'Votre ticket a été envoyé avec succès !',
        [
          {
            text: 'OK',
            onPress: () => {
              setTitle('');
              setDescription('');
              navigation.goBack();
            }
          }
        ]
      );
    }, 1000);
  };

  const handleCancel = () => {
    if (title.trim() || description.trim()) {
      Alert.alert(
        'Annuler',
        'Êtes-vous sûr de vouloir annuler ? Vos modifications seront perdues.',
        [
          { text: 'Non', style: 'cancel' },
          { 
            text: 'Oui', 
            onPress: () => {
              setTitle('');
              setDescription('');
              navigation.goBack();
            }
          }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Créer un Ticket</Title>
          <Paragraph style={styles.subtitle}>
            Décrivez votre problème ou votre demande d'aide
          </Paragraph>
          
          <Divider style={styles.divider} />
          
          <TextInput
            label="Titre du ticket"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            style={styles.input}
            placeholder="Résumez votre problème en quelques mots"
            maxLength={100}
          />
          
          <TextInput
            label="Description détaillée"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            multiline
            numberOfLines={6}
            style={styles.textArea}
            placeholder="Décrivez votre problème en détail : que s'est-il passé ? Quelles étapes avez-vous suivies ? Quel résultat attendiez-vous ?"
            maxLength={1000}
          />
          
          <View style={styles.characterCount}>
            <Paragraph style={styles.countText}>
              {description.length}/1000 caractères
            </Paragraph>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={handleCancel}
          style={[styles.button, styles.cancelButton]}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={[styles.button, styles.submitButton]}
          loading={isSubmitting}
          disabled={isSubmitting || !title.trim() || !description.trim()}
        >
          Envoyer le Ticket
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 16,
  },
  divider: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
  },
  textArea: {
    marginBottom: 8,
    minHeight: 120,
  },
  characterCount: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  countText: {
    fontSize: 12,
    opacity: 0.6,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  button: {
    flex: 1,
  },
  cancelButton: {
    marginRight: 6,
  },
  submitButton: {
    marginLeft: 6,
  },
});

export default TicketScreen;
