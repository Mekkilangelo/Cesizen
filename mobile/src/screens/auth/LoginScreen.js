import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/authSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import useResponsive from '../../hooks/useResponsive';
import apiClient from '../../api/apiClient'; // Ajout de l'import manquant

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const { isLoading, error } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const theme = useTheme();
  const { isMobile } = useResponsive();

  const handleLogin = () => {
    dispatch(loginUser({ email, password }));
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  // Fonction pour tester la connexion à l'API
  const testApiConnection = () => {
    console.log('Testing API connection...');
    fetch(apiClient.defaults.baseURL.replace('/api', ''))
      .then(response => {
        console.log('API response status:', response.status);
        return response.text();
      })
      .then(data => {
        console.log('API response data:', data);
        alert('Connexion au serveur réussie!');
      })
      .catch(error => {
        console.error('API test error:', error);
        alert('Erreur de connexion au serveur: ' + error.message);
      });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    innerContainer: {
      flex: 1,
      padding: theme.spacing.lg,
      justifyContent: 'center',
      maxWidth: isMobile ? '100%' : 500,
      width: '100%',
      alignSelf: 'center',
    },
    logo: {
      width: 120,
      height: 120,
      alignSelf: 'center',
      marginBottom: theme.spacing.xl,
    },
    title: {
      fontSize: theme.fontSize.largeHeading,
      fontWeight: 'bold',
      marginBottom: theme.spacing.md,
      textAlign: 'center',
      color: theme.colors.primary,
    },
    subtitle: {
      fontSize: theme.fontSize.body,
      marginBottom: theme.spacing.xl,
      textAlign: 'center',
      color: theme.colors.placeholder,
    },
    input: {
      marginBottom: theme.spacing.md,
      backgroundColor: 'transparent',
    },
    button: {
      marginTop: theme.spacing.md,
      paddingVertical: 8,
    },
    registerContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: theme.spacing.xl,
    },
    registerText: {
      color: theme.colors.placeholder,
    },
    registerLink: {
      color: theme.colors.primary,
      fontWeight: 'bold',
      marginLeft: 5,
    },
    errorText: {
      color: theme.colors.error,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.innerContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          
          <Text style={styles.title}>Bienvenue sur CesiZen</Text>
          <Text style={styles.subtitle}>Connectez-vous pour accéder à votre espace</Text>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <TextInput
            label="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            disabled={isLoading}
          />
          
          <TextInput
            label="Mot de passe"
            value={password}
            onChangeText={(text) => setPassword(text)}
            mode="outlined"
            style={styles.input}
            secureTextEntry={secureTextEntry}
            right={
              <TextInput.Icon
                icon={secureTextEntry ? "eye" : "eye-off"}
                onPress={toggleSecureEntry}
              />
            }
            disabled={isLoading}
          />
          
          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.button}
            loading={isLoading}
            disabled={isLoading}
          >
            <Text style={{color: 'white'}}>Connexion</Text>
          </Button>
          
          {/* Bouton de test pour la connexion API */}
          <Button
            mode="outlined"
            onPress={testApiConnection}
            style={[styles.button, {marginTop: 10}]}
          >
            <Text>Tester la connexion</Text>
          </Button>
          
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Pas encore de compte ?</Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.registerLink}>S'inscrire</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
