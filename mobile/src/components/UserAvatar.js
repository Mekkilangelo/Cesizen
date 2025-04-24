import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Avatar, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import commonStyles from '../styles/commonStyles';

const UserAvatar = ({ 
  user, 
  size = 40, 
  showName = false, 
  onPress,
  style
}) => {
  const theme = useTheme();
  const initials = user?.username 
    ? user.username.substring(0, 2).toUpperCase() 
    : '?';
    
  const avatarContent = user?.avatarUrl ? (
    <Avatar.Image 
      size={size} 
      source={{ uri: user.avatarUrl }}
      style={styles.avatar}
    />
  ) : (
    <Avatar.Text 
      size={size} 
      label={initials}
      color={theme.colors.surface}
      style={[
        styles.avatar,
        { backgroundColor: theme.colors.primary }
      ]}
    />
  );
  
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[styles.container, style]}
      disabled={!onPress}
    >
      {avatarContent}
      {showName && user?.username && (
        <Text 
          style={styles.username}
          numberOfLines={1}
        >
          {user.username}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 8,
  },
  username: {
    fontWeight: '500',
  }
});

export default UserAvatar;