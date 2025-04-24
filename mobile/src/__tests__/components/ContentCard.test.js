import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { configureStore } from '@reduxjs/toolkit';
import ContentCard from '../../components/ContentCard';
import contentReducer from '../../store/contentSlice';

// Mock des hooks externes
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn()
    })
  };
});

jest.mock('../../hooks/useResponsive', () => {
  return () => ({
    isMobile: true,
    isTablet: false,
    isDesktop: false
  });
});

// Mock pour les icônes
jest.mock('@expo/vector-icons', () => {
  return {
    Ionicons: 'Ionicons'
  };
});

// Configuration pour tester avec Redux
const createTestStore = () => {
  return configureStore({
    reducer: {
      contents: contentReducer
    },
    preloadedState: {
      contents: {
        contentStats: {
          '1': { views: 10, likes: 5, dislikes: 1, favorites: 2, comments: 3 }
        }
      }
    }
  });
};

describe('ContentCard Component', () => {
  const mockContent = {
    id: '1',
    title: 'Test Content',
    body: 'This is a test content description',
    author: {
      id: 'author1',
      username: 'testauthor'
    },
    createdAt: '2023-01-15T12:00:00.000Z',
    type: 'article',
    tags: ['test', 'react']
  };

  const mockNavigation = {
    navigate: jest.fn()
  };

  test('renders correctly with all props', () => {
    const store = createTestStore();
    
    const { getByText, getByTestId } = render(
      <Provider store={store}>
        <NavigationContainer>
          <ContentCard 
            content={mockContent} 
            horizontal={false}
            showDeleteButton={false}
            isFavorite={false}
          />
        </NavigationContainer>
      </Provider>
    );
    
    // Vérifier que les éléments principaux sont affichés
    expect(getByText('Test Content')).toBeTruthy();
    expect(getByText('This is a test content description')).toBeTruthy();
    expect(getByText('testauthor')).toBeTruthy();
    expect(getByText('15 janvier 2023')).toBeTruthy();
    
    // Vérifier que les tags sont affichés
    expect(getByText('test')).toBeTruthy();
    expect(getByText('react')).toBeTruthy();
  });
  
  test('navigates to content detail when pressed', () => {
    const store = createTestStore();
    const navigate = jest.fn();
    
    // Override le mock de useNavigation pour ce test spécifique
    jest.mock('@react-navigation/native', () => ({
      ...jest.requireActual('@react-navigation/native'),
      useNavigation: () => ({
        navigate
      })
    }));
    
    const { getByTestId } = render(
      <Provider store={store}>
        <NavigationContainer>
          <ContentCard content={mockContent} />
        </NavigationContainer>
      </Provider>
    );
    
    // Simuler un appui sur la carte
    fireEvent.press(getByTestId('content-card-touchable'));
    
    // Vérifier que la navigation a été appelée avec les bons paramètres
    expect(navigate).toHaveBeenCalledWith('ContentDetailScreen', {
      id: '1',
      title: 'Test Content'
    });
  });
  
  test('displays favorite badge when isFavorite is true', () => {
    const store = createTestStore();
    
    const { getByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <ContentCard 
            content={mockContent} 
            isFavorite={true}
          />
        </NavigationContainer>
      </Provider>
    );
    
    // Vérifier que le badge favori est affiché
    expect(getByText('Favori')).toBeTruthy();
  });
  
  test('shows delete button when showDeleteButton is true', () => {
    const store = createTestStore();
    
    const { getByTestId } = render(
      <Provider store={store}>
        <NavigationContainer>
          <ContentCard 
            content={mockContent} 
            showDeleteButton={true}
          />
        </NavigationContainer>
      </Provider>
    );
    
    // Vérifier que le bouton de suppression est affiché
    expect(getByTestId('delete-content-button')).toBeTruthy();
  });
  
  test('formats date correctly', () => {
    const store = createTestStore();
    
    // Tester avec différentes dates
    const contents = [
      { ...mockContent, createdAt: '2023-01-15T12:00:00.000Z' },
      { ...mockContent, id: '2', createdAt: '2022-12-25T12:00:00.000Z' }
    ];
    
    const { getByText, rerender } = render(
      <Provider store={store}>
        <NavigationContainer>
          <ContentCard content={contents[0]} />
        </NavigationContainer>
      </Provider>
    );
    
    expect(getByText('15 janvier 2023')).toBeTruthy();
    
    // Re-render avec une date différente
    rerender(
      <Provider store={store}>
        <NavigationContainer>
          <ContentCard content={contents[1]} />
        </NavigationContainer>
      </Provider>
    );
    
    expect(getByText('25 décembre 2022')).toBeTruthy();
  });
});