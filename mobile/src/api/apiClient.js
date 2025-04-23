import axios from 'axios';
import { getSecureItem, STORAGE_KEYS } from '../utils/secureStorage';
import { Platform } from 'react-native';

// Choisir l'URL de l'API en fonction de l'environnement
let API_URL;

// Détecter si nous sommes sur un émulateur ou un appareil physique
if (Platform.OS === 'ios') {
  // Pour iOS Simulator
  API_URL = 'http://localhost:5001/api';
} else if (Platform.OS === 'android') {
  // Pour Android Emulator
  API_URL = 'http://10.0.2.2:5001/api';
} else {
  // Pour le web ou autre plateforme
  API_URL = 'http://localhost:5001/api';
}

// Remplacer par votre adresse IP réelle si vous testez sur un appareil physique
// API_URL = 'http://192.168.1.116:5001/api';

console.log('Using API URL:', API_URL);

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Augmenter le timeout à 30 secondes
});

// Add a request interceptor to add the auth token to every request
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await getSecureItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Added token to request headers');
      } else {
        console.log('No token available for request');
      }
    } catch (error) {
      console.error('Error setting auth token:', error);
    }
    
    // Log the request for debugging
    console.log('Making request to:', config.baseURL + config.url, 'with data:', config.data);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.data);
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout. Vérifiez que votre serveur est bien accessible.');
    } else {
      console.error(
        'API error:', 
        error.message, 
        'Status:', error.response?.status,
        'Data:', error.response?.data
      );
    }
    return Promise.reject(error);
  }
);

export default apiClient;
