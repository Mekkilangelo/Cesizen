import React, { useRef, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Animated, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { pulseAnimation } from '../utils/animationUtils';

const FloatingActionButton = ({ 
  icon = 'add', 
  color, 
  size = 24, 
  onPress, 
  style,
  pulse = false,
  position = 'bottomRight'
}) => {
  const theme = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    if (pulse) {
      pulseAnimation(scaleAnim);
    }
  }, [pulse]);
  
  const getPositionStyle = () => {
    switch (position) {
      case 'bottomLeft':
        return { bottom: theme.spacing.xl, left: theme.spacing.xl };
      case 'topRight':
        return { top: theme.spacing.xl, right: theme.spacing.xl };
      case 'topLeft':
        return { top: theme.spacing.xl, left: theme.spacing.xl };
      case 'bottomRight':
      default:
        return { bottom: theme.spacing.xl, right: theme.spacing.xl };
    }
  };
  
  return (
    <Animated.View
      style={[
        styles.container,
        getPositionStyle(),
        { transform: [{ scale: scaleAnim }] },
        style
      ]}
    >
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: color || theme.colors.primary }
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Ionicons name={icon} size={size} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 999,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
});

export default FloatingActionButton;