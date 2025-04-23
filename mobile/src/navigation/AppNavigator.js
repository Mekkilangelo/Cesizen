import React from 'react';
import { useSelector } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Import des écrans
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen'; // Importez le ProfileScreen réel
import DiagnosticScreen from '../screens/DiagnosticScreen';
import DiagnosticDetailScreen from '../screens/DiagnosticDetailScreen';

// Les écrans principaux - remplacez ces importations par vos propres écrans
const HomeScreen = () => <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text>Accueil</Text></View>;
const ContentScreen = () => <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text>Contenu</Text></View>;

// Navigation Stack
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Navigation d'authentification simple
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
      options={{ title: 'Mes Diagnostics', headerShown: false }}
    />
    <Stack.Screen 
      name="DiagnosticDetail" 
      component={DiagnosticDetailScreen}
      options={({ route }) => ({ 
        title: route.params?.title || 'Détail du diagnostic',
        headerShown: true 
      })}
    />
  </Stack.Navigator>
);

// Navigation principale simple (Tab Navigator)
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
          tabBarLabel: 'Diagnostic',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="clipboard-check" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen 
        name="Content" 
        component={ContentScreen}
        options={{
          tabBarLabel: 'Contenu',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="book-open-variant" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} // Utilisez le ProfileScreen réel maintenant
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

// Navigateur principal ultra simplifié
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
