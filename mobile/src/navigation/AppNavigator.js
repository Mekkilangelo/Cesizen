import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
import GuestContentScreen from '../screens/GuestContentScreen';
import GuestHomeScreen from '../screens/GuestHomeScreen';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import TicketScreen from '../screens/TicketScreen';
import LoginRegisterButton from '../components/LoginRegisterButton';

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

// Navigateur pour les écrans de contenu invité
const GuestContentNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="GuestContentList" 
      component={GuestContentScreen} 
      options={{ title: 'Articles publics', headerShown: true }}
    />
    <Stack.Screen 
      name="GuestContentDetail" 
      component={ContentDetailScreen}
      options={({ route }) => ({ 
        title: route.params?.title || 'Article',
        headerShown: true
      })}
    />
  </Stack.Navigator>
);

// Navigateur pour les écrans de diagnostic invité
const GuestDiagnosticNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="GuestDiagnosticList" 
      component={DiagnosticScreen} 
      options={{ title: 'Tests de stress Holmes-Rahe', headerShown: true }}
    />
    <Stack.Screen 
      name="GuestDiagnosticDetail" 
      component={DiagnosticDetailScreen}
      options={({ route }) => ({ 
        title: route.params?.title || 'Diagnostic partagé',
        headerShown: true
      })}
    />
    <Stack.Screen 
      name="HolmesRaheDiagnostic" 
      component={HolmesRaheDiagnosticScreen} 
      options={{ title: "Test de stress Holmes-Rahe" }} 
    />
  </Stack.Navigator>
);

// Navigation principale pour les visiteurs anonymes avec barre d'onglets
const GuestTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: true,
      tabBarActiveTintColor: '#3498db',
      tabBarInactiveTintColor: '#95a5a6',
    }}
  >
    <Tab.Screen 
      name="GuestHome" 
      component={GuestHomeScreen} 
      options={{
        title: 'Accueil',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="home" color={color} size={26} />
        ),
        tabBarTestID: "guest-tab-home"
      }}
    />
    <Tab.Screen 
      name="GuestContent" 
      component={GuestContentNavigator}
      options={{
        title: 'Articles',
        headerShown: false,
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="file-document" color={color} size={26} />
        ),
        tabBarTestID: "guest-tab-content"
      }}
    />
    <Tab.Screen 
      name="GuestDiagnostic" 
      component={GuestDiagnosticNavigator}
      options={{
        title: 'Diagnostics',
        headerShown: false,
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="heart-pulse" color={color} size={26} />
        ),
        tabBarTestID: "guest-tab-diagnostic"
      }}
    />
    <Tab.Screen 
      name="Login" 
      component={LoginRegisterButton}
      options={{
        title: 'Connexion',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="login" color={color} size={26} />
        ),
        tabBarTestID: "guest-tab-login"
      }}
    />
  </Tab.Navigator>
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
    <Stack.Screen 
      name="TicketScreen" 
      component={TicketScreen}
      options={{ 
        title: 'Support',
        headerShown: true
      }}
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

// Navigateur pour l'administration
const AdminNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="AdminDashboard" 
      component={AdminDashboardScreen} 
      options={{ title: 'Administration', headerShown: true }}
    />
  </Stack.Navigator>
);

// Navigation principale des utilisateurs connectés normaux
const UserTabNavigator = () => {
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
          tabBarTestID: "bottom-tab-home"
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
          tabBarTestID: "bottom-tab-diagnostic"
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
          tabBarTestID: "bottom-tab-create"
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
          tabBarTestID: "bottom-tab-profile"
        }}
      />
    </Tab.Navigator>
  );
};

// Navigation principale des administrateurs
const AdminTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#e74c3c',
        tabBarInactiveTintColor: '#95a5a6',
      }}
    >
      <Tab.Screen 
        name="AdminHome" 
        component={AdminNavigator} 
        options={{
          title: 'Administration',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="shield-account" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen 
        name="Home" 
        component={HomeNavigator} 
        options={{
          title: 'Accueil',
          headerShown: false,
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

// Navigateur principal qui détermine la navigation en fonction du rôle de l'utilisateur
const AppNavigator = () => {
  const auth = useSelector(state => state.auth);
  const { isAuthenticated, user } = auth;
  
  // Ajouter un log pour déboguer
  useEffect(() => {
    console.log('État d\'authentification:', { isAuthenticated, hasUser: !!user });
    if (user) {
      console.log('Rôle de l\'utilisateur:', user.role);
    }
  }, [isAuthenticated, user]);

  // Créer un Stack Navigator racine pour inclure tous les navigateurs
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        // Si l'utilisateur n'est pas authentifié, afficher l'écran de connexion ou l'écran invité
        <>
          <Stack.Screen name="GuestTabs" component={GuestTabNavigator} />
          <Stack.Screen name="Auth" component={AuthNavigator} />
        </>
      ) : user?.role === 'admin' ? (
        // Si l'utilisateur est un administrateur
        <Stack.Screen name="AdminTabs" component={AdminTabNavigator} />
      ) : (
        // Si l'utilisateur est un utilisateur normal
        <Stack.Screen name="UserTabs" component={UserTabNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
