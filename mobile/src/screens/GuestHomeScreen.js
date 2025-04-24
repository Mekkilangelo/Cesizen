import React from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { Text, Card, Button, useTheme, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const GuestHomeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const navigateToDiagnostic = () => {
    // Autoriser un visiteur à faire le test sans compte
    navigation.navigate('GuestDiagnostic', { 
      screen: 'HolmesRaheDiagnostic'
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    headerSection: {
      padding: 20,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'white',
      marginBottom: 10,
      textAlign: 'center',
    },
    headerSubtitle: {
      fontSize: 16,
      color: 'white',
      opacity: 0.9,
      marginBottom: 20,
      textAlign: 'center',
    },
    section: {
      padding: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 15,
      color: theme.colors.text,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 20,
      marginBottom: 10,
    },
    button: {
      minWidth: 120,
      marginVertical: 10,
    },
    buttonsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 10,
    },
    contentCard: {
      marginBottom: 15,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginVertical: 20,
      padding: 10,
      backgroundColor: '#f7f7f7',
      borderRadius: 8,
    },
    statBox: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    statLabel: {
      fontSize: 12,
      color: theme.colors.placeholder,
    },
    footer: {
      padding: 20,
      backgroundColor: '#f0f0f0',
      alignItems: 'center',
    },
    logoContainer: {
      alignItems: 'center',
      marginVertical: 20,
    },
    logo: {
      width: 120,
      height: 120,
      resizeMode: 'contain',
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerSection}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/logo.png')}
            style={styles.logo}
          />
        </View>
        <Text style={styles.headerTitle}>Bienvenue sur Cesizen</Text>
        <Text style={styles.headerSubtitle}>
          La plateforme qui vous aide à gérer votre stress et à améliorer votre bien-être.
        </Text>
        <View style={styles.buttonsRow}>
          <Button 
            mode="contained" 
            style={{ marginHorizontal: 5 }}
            onPress={() => navigation.navigate('Auth', { screen: 'Login' })}
          >
            Se connecter
          </Button>
          <Button 
            mode="outlined" 
            style={{ marginHorizontal: 5 }}
            onPress={() => navigation.navigate('Auth', { screen: 'Register' })}
          >
            S'inscrire
          </Button>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Découvrez Cesizen</Text>
        <Card style={{ marginBottom: 20 }}>
          <Card.Content>
            <Text style={{ marginBottom: 10 }}>
              Cesizen est une application qui vous aide à mesurer votre niveau de stress avec l'échelle Holmes-Rahe, 
              à accéder à des informations sur la gestion du stress et à partager votre expérience avec d'autres.
            </Text>
            <Text>
              Créez un compte pour accéder à toutes les fonctionnalités et commencer à prendre soin de votre santé mentale.
            </Text>
          </Card.Content>
        </Card>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>Test</Text>
            <Text style={styles.statLabel}>Holmes-Rahe</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>Articles</Text>
            <Text style={styles.statLabel}>& Conseils</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>Partage</Text>
            <Text style={styles.statLabel}>& Communauté</Text>
          </View>
        </View>
      </View>

      <Divider />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test de stress Holmes-Rahe</Text>
        <Card>
          <Card.Content>
            <Text style={{ marginBottom: 10 }}>
              L'échelle de stress de Holmes-Rahe est un outil qui mesure l'impact des événements de vie stressants
              sur votre santé. Découvrez votre niveau de risque de développer une maladie liée au stress.
            </Text>
            <Button 
              mode="contained" 
              style={styles.button}
              onPress={navigateToDiagnostic}
            >
              Faire le test
            </Button>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.footer}>
        <Text>Cesizen © 2025 - Tous droits réservés</Text>
        <Text>Une application développée pour votre bien-être</Text>
      </View>
    </ScrollView>
  );
};

export default GuestHomeScreen;