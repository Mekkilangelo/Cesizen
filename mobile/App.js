import React, { useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, ActivityIndicator, Platform } from 'react-native';
import { store, persistor } from './src/store';
import { setToken, fetchUserProfile } from './src/store/authSlice';
import AppNavigator from './src/navigation/AppNavigator';
import theme from './src/theme';
import { getSecureItem, STORAGE_KEYS } from './src/utils/secureStorage';

// Token initializer component
const TokenInitializer = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Log platform info for debugging
    console.log('Running on platform:', Platform.OS);
    console.log('Using storage keys:', STORAGE_KEYS);
    
    const loadToken = async () => {
      try {
        // Use our platform-specific storage implementation
        const token = await getSecureItem(STORAGE_KEYS.AUTH_TOKEN);
        console.log('Retrieved token:', token ? 'Token exists' : 'No token found');
        
        if (token) {
          dispatch(setToken(token));
          dispatch(fetchUserProfile());
        }
      } catch (error) {
        console.error('Failed to load authentication token', error);
      }
    };
    
    loadToken();
  }, [dispatch]);
  
  return null;
};

// Simple error boundary component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            Something went wrong
          </Text>
          <Text style={{ marginBottom: 20 }}>
            {this.state.error?.toString()}
          </Text>
          <Text style={{ marginTop: 20 }}>
            Check your console for more information.
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

// Loading component to replace text node
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color={theme.colors.primary} />
    <Text style={{ marginTop: 10 }}>Loading...</Text>
  </View>
);

export default function App() {
  return (
    <ErrorBoundary>
      <ReduxProvider store={store}>
        <PersistGate loading={<LoadingScreen />} persistor={persistor}>
          <PaperProvider theme={theme}>
            <SafeAreaProvider>
              <NavigationContainer>
                <TokenInitializer />
                <AppNavigator />
              </NavigationContainer>
            </SafeAreaProvider>
          </PaperProvider>
        </PersistGate>
      </ReduxProvider>
    </ErrorBoundary>
  );
}
