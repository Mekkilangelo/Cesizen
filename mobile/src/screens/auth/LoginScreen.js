import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  Image 
} from 'react-native';
import { 
  TextInput, 
  Button, 
  Text, 
  useTheme, 
  HelperText 
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/authSlice';
import commonStyles from '../../styles/commonStyles';

const LoginScreen = ({ navigation }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(state => state.auth);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('L\'email est requis');
      return false;
    } else if (!regex.test(email)) {
      setEmailError('Format d\'email invalide');
      return false;
    }
    setEmailError('');
    return true;
  };
  
  const validatePassword = (password) => {
    if (!password) {
      setPasswordError('Le mot de passe est requis');
      return false;
    } else if (password.length < 6) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    setPasswordError('');
    return true;
  };
  
  const handleLogin = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (isEmailValid && isPasswordValid) {
      try {
        await dispatch(loginUser({ email, password })).unwrap();
        // La redirection sera gérée par le composant App en fonction du statut d'authentification
      } catch (error) {
        console.error('Erreur de connexion:', error);
      }
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>Cesizen</Text>
          <Text style={styles.tagline}>La communauté des étudiants CESI</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.title}>Connexion</Text>
          
          {error && (
            <HelperText type="error" style={styles.errorMessage}>
              {error}
            </HelperText>
          )}
          
          <View style={styles.inputContainer}>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              onBlur={() => validateEmail(email)}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              left={<TextInput.Icon icon="email" color={theme.colors.primary} />}
              style={styles.input}
              outlineColor={theme.colors.primary}
              activeOutlineColor={theme.colors.primary}
              error={!!emailError}
            />
            {emailError ? (
              <HelperText type="error" visible={!!emailError}>
                {emailError}
              </HelperText>
            ) : null}
          </View>
          
          <View style={styles.inputContainer}>
            <TextInput
              label="Mot de passe"
              value={password}
              onChangeText={setPassword}
              onBlur={() => validatePassword(password)}
              mode="outlined"
              secureTextEntry={!showPassword}
              left={<TextInput.Icon icon="lock" color={theme.colors.primary} />}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  onPress={togglePasswordVisibility}
                  color={theme.colors.primary}
                />
              }
              style={styles.input}
              outlineColor={theme.colors.primary}
              activeOutlineColor={theme.colors.primary}
              error={!!passwordError}
            />
            {passwordError ? (
              <HelperText type="error" visible={!!passwordError}>
                {passwordError}
              </HelperText>
            ) : null}
          </View>
          
          <Button
            mode="contained"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
            style={styles.loginButton}
            labelStyle={styles.buttonLabel}
            buttonColor={theme.colors.primary}
          >
            Se connecter
          </Button>
          
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Mot de passe oublié?</Text>
          </TouchableOpacity>
          
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Vous n'avez pas de compte?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>S'inscrire</Text>
            </TouchableOpacity>
          </View>
          
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('GuestTabs')}
            style={styles.guestButton}
            labelStyle={styles.guestButtonLabel}
            icon="account-arrow-right"
          >
            Continuer en tant qu'invité
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 10,
  },
  tagline: {
    fontSize: 16,
    color: '#757575',
    marginTop: 5,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    ...commonStyles.shadowMedium,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2E3D2D',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#fff',
  },
  errorMessage: {
    fontSize: 14,
    color: '#E53935',
    marginBottom: 16,
    textAlign: 'center',
  },
  loginButton: {
    marginTop: 10,
    borderRadius: 8,
    padding: 4,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 2,
  },
  forgotPassword: {
    marginTop: 16,
    alignSelf: 'center',
  },
  forgotPasswordText: {
    color: '#4CAF50',
    fontSize: 14,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    color: '#757575',
    marginRight: 5,
  },
  registerLink: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  guestButton: {
    marginTop: 30,
    borderColor: '#FFC107',
    borderRadius: 8,
  },
  guestButtonLabel: {
    color: '#FFC107',
  },
});

export default LoginScreen;
