import { useAnimatedStyle as useAnimatedStyleOriginal } from 'react-native-reanimated';

// Création d'un wrapper pour useAnimatedStyle qui inclut un tableau de dépendances vide par défaut
export const useAnimatedStyle = (styleCallback, dependencies = []) => {
  return useAnimatedStyleOriginal(styleCallback, dependencies);
};

// Exportez d'autres fonctions de reanimated si nécessaire
