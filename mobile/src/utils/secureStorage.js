import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Constants for storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'userToken',
};

/**
 * Platform-specific storage implementation
 * Uses AsyncStorage for now, but can be extended to use SecureStore on native platforms
 * once the compatibility issues are resolved
 */

// Get an item from storage
export const getSecureItem = async (key) => {
  try {
    // For now, use AsyncStorage on all platforms until SecureStore issues are resolved
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {
    console.error(`Error reading ${key} from storage:`, error);
    return null;
  }
};

// Save an item to storage
export const setSecureItem = async (key, value) => {
  try {
    // For now, use AsyncStorage on all platforms until SecureStore issues are resolved
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
    return false;
  }
};

// Remove an item from storage
export const removeSecureItem = async (key) => {
  try {
    // For now, use AsyncStorage on all platforms until SecureStore issues are resolved
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from storage:`, error);
    return false;
  }
};

/*
 * NOTE: Once SecureStore compatibility issues are resolved, you can replace the implementation
 * with platform-specific code like this:
 * 
 * if (Platform.OS === 'ios' || Platform.OS === 'android') {
 *   // Use SecureStore on native platforms
 *   const SecureStore = require('expo-secure-store');
 *   // Use SecureStore functions here
 * } else {
 *   // Use AsyncStorage or localStorage on web/other platforms
 *   // ...
 * }
 */
