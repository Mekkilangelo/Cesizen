import { Platform } from 'react-native';
import { Animated, Easing } from 'react-native';

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

// Animation de fondu à l'entrée
export const fadeIn = (animatedValue, duration = 300) => {
  Animated.timing(animatedValue, {
    toValue: 1,
    duration,
    easing: Easing.ease,
    useNativeDriver: true,
  }).start();
};

// Animation de fondu à la sortie
export const fadeOut = (animatedValue, duration = 300) => {
  Animated.timing(animatedValue, {
    toValue: 0,
    duration,
    easing: Easing.ease,
    useNativeDriver: true,
  }).start();
};

// Animation de déplacement vers le haut
export const slideUp = (animatedValue, fromValue = 50, toValue = 0, duration = 300) => {
  animatedValue.setValue(fromValue);
  Animated.timing(animatedValue, {
    toValue,
    duration,
    easing: Easing.out(Easing.ease),
    useNativeDriver: true,
  }).start();
};

// Animation de déplacement vers le bas
export const slideDown = (animatedValue, fromValue = 0, toValue = 50, duration = 300) => {
  animatedValue.setValue(fromValue);
  Animated.timing(animatedValue, {
    toValue,
    duration,
    easing: Easing.in(Easing.ease),
    useNativeDriver: true,
  }).start();
};

// Animation de scale
export const scaleUp = (animatedValue, toValue = 1, duration = 300) => {
  animatedValue.setValue(0.8);
  Animated.timing(animatedValue, {
    toValue,
    duration,
    easing: Easing.elastic(1),
    useNativeDriver: true,
  }).start();
};

// Animation lors du tap sur un élément
export const pressAnimation = (animatedValue) => {
  Animated.sequence([
    Animated.timing(animatedValue, {
      toValue: 0.95,
      duration: 100,
      easing: Easing.ease,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 100,
      easing: Easing.ease,
      useNativeDriver: true,
    }),
  ]).start();
};

// Animation de pulsation continue
export const pulseAnimation = (animatedValue, duration = 1500) => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1.05,
        duration: duration / 2,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: duration / 2,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ])
  ).start();
};

// Animation de staggered pour les listes
export const staggeredFadeIn = (items, initialDelay = 0, itemDelay = 50) => {
  const animations = items.map((item, i) => {
    return Animated.timing(item, {
      toValue: 1,
      duration: 400,
      delay: initialDelay + (i * itemDelay),
      useNativeDriver: true,
      easing: Easing.ease,
    });
  });
  
  Animated.stagger(itemDelay, animations).start();
};

export default {
  fadeIn,
  fadeOut,
  slideUp,
  slideDown,
  scaleUp,
  pressAnimation,
  pulseAnimation,
  staggeredFadeIn,
};
