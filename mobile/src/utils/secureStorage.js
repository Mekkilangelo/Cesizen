import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Clés pour le stockage sécurisé
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'userToken',
  USER_PROFILE: 'userProfile',
  APP_SETTINGS: 'appSettings',
};

// Fonction pour stocker une valeur de manière sécurisée
export const setSecureItem = async (key, value) => {
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    } else {
      await SecureStore.setItemAsync(key, typeof value === 'string' ? value : JSON.stringify(value));
    }
    return true;
  } catch (error) {
    console.error(`Erreur lors du stockage de ${key}:`, error);
    return false;
  }
};

// Fonction pour récupérer une valeur stockée
export const getSecureItem = async (key, parse = false) => {
  try {
    let value;
    if (Platform.OS === 'web') {
      value = localStorage.getItem(key);
    } else {
      value = await SecureStore.getItemAsync(key);
    }
    
    if (value && parse) {
      return JSON.parse(value);
    }
    return value;
  } catch (error) {
    console.error(`Erreur lors de la récupération de ${key}:`, error);
    return null;
  }
};

// Fonction pour supprimer une valeur stockée
export const deleteSecureItem = async (key) => {
  try {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
    return true;
  } catch (error) {
    console.error(`Erreur lors de la suppression de ${key}:`, error);
    return false;
  }
};
