import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme, Text, Button, Avatar, Card, Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/authSlice';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileScreen = ({ navigation }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      
      // En regardant votre AppNavigator.js, je vois que la navigation 
      // dépend du state.auth.userToken, pas d'une navigation explicite
      // Donc ne pas utiliser navigation.navigate ici
      
      // Si vous voulez forcer la navigation, utilisez le reset
      // navigation.reset({
      //   index: 0,
      //   routes: [{ name: 'Auth' }],
      // });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Si on n'a pas d'utilisateur, afficher un message d'erreur
  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Utilisateur non connecté</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Avatar.Text 
            size={80} 
            label={user.username.substring(0, 2).toUpperCase()} 
            backgroundColor={theme.colors.primary}
            testID="user-menu-button"
          />
          <Text style={styles.username} testID="profile-username">{user.username}</Text>
          <Text style={styles.email} testID="profile-email">{user.email}</Text>
        </View>

        <Card style={styles.card}>
          <Card.Title title="Informations du profil" />
          <Card.Content>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nom d'utilisateur:</Text>
              <Text style={styles.infoValue}>{user.username}</Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Rôle:</Text>
              <Text style={styles.infoValue}>{user.role || 'Utilisateur'}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Bouton de déconnexion */}
        <Button 
          mode="contained" 
          onPress={handleLogout}
          style={styles.logoutButton}
          icon="logout"
          testID="logout-button"
        >
          Se déconnecter
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  card: {
    margin: 10,
    elevation: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#555',
  },
  infoValue: {
    maxWidth: '60%',
  },
  divider: {
    marginVertical: 8,
  },
  logoutButton: {
    margin: 20,
    paddingVertical: 8,
    backgroundColor: '#e53935',
  },
});

export default ProfileScreen;
