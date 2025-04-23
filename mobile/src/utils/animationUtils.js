import { Platform } from 'react-native';
import { Animated } from 'react-native';

// Utiliser des animations standards de React Native au lieu de Reanimated
// jusqu'à ce que nous résolvions les problèmes de configuration

export const createAnimation = (initialValue) => {
  return new Animated.Value(initialValue);
};

export const animateTo = (animatedValue, toValue, duration = 300, callback = null) => {
  Animated.timing(animatedValue, {
    toValue,
    duration,
    useNativeDriver: Platform.OS !== 'web', // false pour le web
  }).start(callback);
};

// Ajouter d'autres fonctions d'animation selon vos besoins
