import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

// Import des écrans
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DiagnosticScreen from '../screens/DiagnosticScreen';
import DiagnosticDetailScreen from '../screens/DiagnosticDetailScreen';
import HolmesRaheDiagnosticScreen from '../screens/HolmesRaheDiagnosticScreen';
import CreateContentScreen from '../screens/CreateContentScreen';
import HomeScreen from '../screens/HomeScreen';
import ContentDetailScreen from '../screens/ContentDetailScreen';

// Navigation Stack
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Navigation d'authentification
const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// Créer un navigateur de pile pour l'écran Home
const HomeNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="HomeScreen" 
      component={HomeScreen} 
      options={{ title: 'Accueil', headerShown: true }}
    />
    <Stack.Screen 
      name="ContentDetailScreen" 
      component={ContentDetailScreen}
      options={({ route }) => ({ 
        title: route.params?.title || 'Détail du contenu',
        headerShown: true
      })}
    />
  </Stack.Navigator>
);

// Navigateur pour les diagnostics
const DiagnosticNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="DiagnosticsList" 
      component={DiagnosticScreen} 
      options={{ title: 'Tests de stress Holmes-Rahe', headerShown: true }}
    />
    <Stack.Screen 
      name="DiagnosticDetail" 
      component={DiagnosticDetailScreen}
      options={({ route }) => ({ 
        title: route.params?.title || 'Résultat du test de stress'
      })}
    />
    <Stack.Screen 
      name="HolmesRaheDiagnostic" 
      component={HolmesRaheDiagnosticScreen} 
      options={{ title: "Test de stress Holmes-Rahe" }} 
    />
  </Stack.Navigator>
);

// Navigation principale mise à jour pour utiliser HomeNavigator
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: '#95a5a6',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeNavigator} 
        options={{
          title: 'Accueil',
          headerShown: false, // Cachez l'en-tête de l'onglet car HomeNavigator a son propre en-tête
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen 
        name="Diagnostic" 
        component={DiagnosticNavigator}
        options={{
          tabBarLabel: 'Tests de stress',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="heart-pulse" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen 
        name="CreateContent"
        component={CreateContentScreen}
        options={{
          title: 'Créer',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Navigateur principal
const AppNavigator = () => {
  const auth = useSelector(state => state.auth);
  const { isAuthenticated, token, user } = auth;
  
  // Ajouter un log pour déboguer
  useEffect(() => {
    console.log('État d\'authentification:', { isAuthenticated, hasToken: !!token, hasUser: !!user });
  }, [isAuthenticated, token, user]);
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
