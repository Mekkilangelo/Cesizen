import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const LoginRegisterButton = ({ mode = "contained", isLogin = true, style }) => {
  const navigation = useNavigation();
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 20,
      color: theme.colors.primary,
    },
    buttonContainer: {
      width: '100%',
      gap: 10,
      marginTop: 10,
    },
    button: {
      marginHorizontal: 5,
    }
  });

  const handleLogin = () => {
    // Navigation standard vers l'écran de connexion
    navigation.navigate('Auth', { screen: 'Login' });
  };

  const handleRegister = () => {
    // Navigation standard vers l'écran d'inscription
    navigation.navigate('Auth', { screen: 'Register' });
  };

  // Si utilisé comme un composant d'écran dans la tab bar
  if (!style) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Rejoindre Cesizen</Text>
        <View style={styles.buttonContainer}>
          <Button 
            mode="contained" 
            style={styles.button}
            onPress={handleLogin}
          >
            Se connecter
          </Button>
          <Button 
            mode="outlined" 
            style={[styles.button, { marginTop: 10 }]}
            onPress={handleRegister}
          >
            S'inscrire
          </Button>
        </View>
      </View>
    );
  }
  
  // Si utilisé comme un bouton simple
  return (
    <Button 
      mode={mode} 
      style={[styles.button, style]}
      onPress={isLogin ? handleLogin : handleRegister}
    >
      {isLogin ? 'Se connecter' : 'S\'inscrire'}
    </Button>
  );
};

export default LoginRegisterButton;