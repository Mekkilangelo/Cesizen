import React from 'react';
import { useSelector } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Import des écrans
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DiagnosticScreen from '../screens/DiagnosticScreen';
import DiagnosticDetailScreen from '../screens/DiagnosticDetailScreen';
import HolmesRaheDiagnosticScreen from '../screens/HolmesRaheDiagnosticScreen';

// Écran d'accueil simple
const HomeScreen = () => (
  <View style={{flex:1, justifyContent:'center', alignItems:'center', padding: 20}}>
    <Text style={{fontSize: 22, fontWeight: 'bold', marginBottom: 20}}>
      Bienvenue sur CesiZen
    </Text>
    <Text style={{textAlign: 'center', lineHeight: 24, marginBottom: 20}}>
      Cette application vous permet d'évaluer votre niveau de stress selon l'échelle Holmes et Rahe.
    </Text>
    <Text style={{textAlign: 'center', lineHeight: 24}}>
      Accédez à l'onglet "Diagnostics" pour réaliser un test de stress ou consulter vos résultats précédents.
    </Text>
  </View>
);

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

// Navigation principale simplifiée
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
        component={HomeScreen} 
        options={{
          title: 'Accueil',
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
  const { userToken } = useSelector(state => state.auth);
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userToken ? (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
