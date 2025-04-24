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

// Définir une URL alternative - décommentez et remplacez par votre adresse IP si nécessaire
// API_URL = 'http://192.168.1.15:5001/api';  // Remplacez par votre adresse IP réelle

console.log('Using API URL:', API_URL);

// Pour le développement Web, créer une fonction pour tester si le serveur est accessible
const testServerConnection = async () => {
  try {
    const response = await fetch(API_URL.replace('/api', ''));
    console.log('Test de connexion serveur:', response.status);
    return response.status >= 200 && response.status < 300;
  } catch (error) {
    console.error('Erreur de connexion au serveur:', error);
    return false;
  }
};

// Exporter la fonction pour qu'elle puisse être utilisée ailleurs
export { testServerConnection };

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Augmenter le timeout à 30 secondes
});

// Combinaison des deux intercepteurs en un seul
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await getSecureItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Token ajouté aux en-têtes');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du token:', error);
    }
    
    console.log('Requête API:', config.method.toUpperCase(), config.url, config.headers);
    return config;
  },
  error => {
    console.error('Erreur de requête API:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  response => {
    console.log('Réponse API:', response.status, response.config.url);
    return response;
  },
  error => {
    console.error('Erreur de réponse API:', 
      error.response ? error.response.status : 'Pas de réponse',
      error.config ? error.config.url : 'URL inconnue'
    );
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
