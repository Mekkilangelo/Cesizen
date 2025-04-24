import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../store/authSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import useResponsive from '../../hooks/useResponsive';
import apiClient from '../../api/apiClient';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [passwordError, setPasswordError] = useState('');
  const { isLoading, error } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const theme = useTheme();
  const { isMobile } = useResponsive();

  const validateForm = () => {
    // Vérification de champs vides
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setPasswordError('Tous les champs sont obligatoires');
      return false;
    }
    
    // Validation basique d'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setPasswordError('Adresse email invalide');
      return false;
    }
    
    // Vérification de la longueur du mot de passe
    if (password.length < 6) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    
    if (password !== confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return false;
    }
    
    setPasswordError('');
    return true;
  };

  const handleRegister = () => {
    if (validateForm()) {
      dispatch(registerUser({ username, email, password }));
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const testApiConnection = () => {
    console.log('Testing API connection...');
    import('../../api/apiClient').then(({ testServerConnection }) => {
      testServerConnection()
        .then(isConnected => {
          if (isConnected) {
            alert('✅ Connexion au serveur réussie!\nL\'API est accessible.');
          } else {
            alert('⚠️ Le serveur est accessible mais répond avec une erreur.');
          }
        })
        .catch(error => {
          console.error('API test error:', error);
          alert('❌ Erreur de connexion au serveur: ' + error.message + '\nVérifiez que votre serveur backend est bien démarré sur le port 5001.');
        });
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
    loginContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: theme.spacing.xl,
    },
    loginText: {
      color: theme.colors.placeholder,
    },
    loginLink: {
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
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.innerContainer}>
            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>Rejoignez CesiZen et commencez à améliorer votre entreprise</Text>
            
            {error && <Text style={styles.errorText}>{error}</Text>}
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            
            <TextInput
              label="Nom d'utilisateur"
              value={username}
              onChangeText={(text) => setUsername(text)}
              mode="outlined"
              style={styles.input}
              autoCapitalize="none"
              disabled={isLoading}
            />
            
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
            
            <TextInput
              label="Confirmer le mot de passe"
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
              mode="outlined"
              style={styles.input}
              secureTextEntry={secureTextEntry}
              disabled={isLoading}
            />
            
            <Button
              mode="contained"
              onPress={handleRegister}
              style={styles.button}
              loading={isLoading}
              disabled={isLoading}
            >
              <Text style={{color: 'white'}}>S'inscrire</Text>
            </Button>
            
            <Button
              mode="outlined"
              onPress={testApiConnection}
              style={[styles.button, {marginTop: 10}]}
            >
              <Text>Tester la connexion</Text>
            </Button>
            
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Déjà un compte ?</Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.loginLink}>Se connecter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
