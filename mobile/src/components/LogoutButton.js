import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, IconButton, useTheme } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../store/authSlice';

// Bouton de déconnexion qui peut être utilisé n'importe où dans l'application
export const LogoutButton = ({ mode = 'text', compact = false, icon = true }) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  if (compact) {
    return (
      <IconButton
        icon="logout"
        color={theme.colors.error}
        size={24}
        onPress={handleLogout}
        testID="logout-button"
      />
    );
  }

  return (
    <Button
      mode={mode}
      onPress={handleLogout}
      style={styles.button}
      icon={icon ? "logout" : null}
      color={mode === 'contained' ? 'white' : theme.colors.error}
      labelStyle={mode === 'contained' ? styles.buttonTextContained : styles.buttonText}
      contentStyle={styles.buttonContent}
      testID="logout-button"
    >
      Se déconnecter
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#e53935',
    marginVertical: 10,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  buttonText: {
    color: '#e53935',
  },
  buttonTextContained: {
    color: 'white',
  },
});

export default LogoutButton;
