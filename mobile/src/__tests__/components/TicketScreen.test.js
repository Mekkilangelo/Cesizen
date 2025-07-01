import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { configureStore } from '@reduxjs/toolkit';
import TicketScreen from '../../screens/TicketScreen';

// Mock store minimal
const mockStore = configureStore({
  reducer: {
    auth: (state = { user: { id: 1, username: 'testuser' } }) => state,
  },
});

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

const renderWithProviders = (component) => {
  return render(
    <Provider store={mockStore}>
      <PaperProvider>
        <NavigationContainer>
          {component}
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
};

describe('TicketScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(
      <TicketScreen navigation={mockNavigation} />
    );

    expect(getByText('Créer un Ticket')).toBeTruthy();
    expect(getByText('Décrivez votre problème ou votre demande d\'aide')).toBeTruthy();
    expect(getByPlaceholderText('Résumez votre problème en quelques mots')).toBeTruthy();
    expect(getByText('Envoyer le Ticket')).toBeTruthy();
    expect(getByText('Annuler')).toBeTruthy();
  });

  it('should show error when trying to submit empty form', () => {
    const { getByText } = renderWithProviders(
      <TicketScreen navigation={mockNavigation} />
    );

    const submitButton = getByText('Envoyer le Ticket');
    
    // Le bouton devrait être désactivé quand les champs sont vides
    expect(submitButton.props.accessibilityState.disabled).toBe(true);
  });

  it('should enable submit button when form is filled', () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(
      <TicketScreen navigation={mockNavigation} />
    );

    const titleInput = getByPlaceholderText('Résumez votre problème en quelques mots');
    const descriptionInput = getByPlaceholderText(/Décrivez votre problème en détail/);
    const submitButton = getByText('Envoyer le Ticket');

    fireEvent.changeText(titleInput, 'Problème de connexion');
    fireEvent.changeText(descriptionInput, 'Je ne peux pas me connecter à l\'application');

    // Le bouton devrait être activé quand les champs sont remplis
    expect(submitButton.props.accessibilityState.disabled).toBe(false);
  });

  it('should call navigation.goBack when cancel is pressed with empty form', () => {
    const { getByText } = renderWithProviders(
      <TicketScreen navigation={mockNavigation} />
    );

    const cancelButton = getByText('Annuler');
    fireEvent.press(cancelButton);

    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('should update character count when typing in description', () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(
      <TicketScreen navigation={mockNavigation} />
    );

    const descriptionInput = getByPlaceholderText(/Décrivez votre problème en détail/);
    const testText = 'Test description';
    
    fireEvent.changeText(descriptionInput, testText);

    expect(getByText(`${testText.length}/1000 caractères`)).toBeTruthy();
  });
});
