import { renderHook, act } from '@testing-library/react-hooks';
import useResponsive, { DEVICE_TYPES } from '../../src/hooks/useResponsive';
import { Dimensions, Platform } from 'react-native';

// Mock des modules React Native
jest.mock('react-native', () => ({
  Dimensions: {
    get: jest.fn(),
    addEventListener: jest.fn(),
  },
  Platform: {
    OS: 'web',
  },
}));

describe('useResponsive', () => {
  let dimensionsEventCallback;
  let mockRemove;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configurez le mock pour Dimensions.addEventListener
    mockRemove = jest.fn();
    Dimensions.addEventListener.mockImplementation((event, callback) => {
      dimensionsEventCallback = callback;
      return { remove: mockRemove };
    });
  });
  
  test('devrait retourner isMobile=true pour un appareil mobile (< 768px)', () => {
    // Mock de Dimensions.get pour une largeur de mobile
    Dimensions.get.mockReturnValue({ width: 375, height: 667 });
    
    const { result } = renderHook(() => useResponsive());
    
    expect(result.current.deviceType).toBe(DEVICE_TYPES.MOBILE);
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(false);
    expect(result.current.orientation).toBe('portrait');
  });
  
  test('devrait retourner isTablet=true pour un appareil tablette (768-1023px)', () => {
    // Mock de Dimensions.get pour une largeur de tablette
    Dimensions.get.mockReturnValue({ width: 800, height: 1024 });
    
    const { result } = renderHook(() => useResponsive());
    
    expect(result.current.deviceType).toBe(DEVICE_TYPES.TABLET);
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(true);
    expect(result.current.isDesktop).toBe(false);
    expect(result.current.orientation).toBe('portrait');
  });
  
  test('devrait retourner isDesktop=true pour un appareil desktop (>= 1024px)', () => {
    // Mock de Dimensions.get pour une largeur de desktop
    Dimensions.get.mockReturnValue({ width: 1200, height: 800 });
    
    const { result } = renderHook(() => useResponsive());
    
    expect(result.current.deviceType).toBe(DEVICE_TYPES.DESKTOP);
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(true);
    expect(result.current.orientation).toBe('landscape');
  });
  
  test('devrait mettre à jour les dimensions lors d\'un changement d\'écran', () => {
    // Configuration initiale en mode portrait
    Dimensions.get.mockReturnValue({ width: 375, height: 667 });
    
    const { result } = renderHook(() => useResponsive());
    
    // Vérifier l'état initial
    expect(result.current.orientation).toBe('portrait');
    
    // Simuler une rotation vers le paysage
    act(() => {
      dimensionsEventCallback({ window: { width: 667, height: 375 } });
    });
    
    // Vérifier que l'orientation a changé
    expect(result.current.orientation).toBe('landscape');
  });
  
  test('devrait nettoyer l\'écouteur d\'événement lors du démontage', () => {
    Dimensions.get.mockReturnValue({ width: 375, height: 667 });
    
    const { unmount } = renderHook(() => useResponsive());
    
    // Démonter le hook
    unmount();
    
    // Vérifier que la fonction de nettoyage a été appelée
    expect(mockRemove).toHaveBeenCalled();
  });
  
  test('devrait toujours retourner isMobile=true pour les plateformes natives (non web)', () => {
    // Changer temporairement la plateforme à iOS
    const originalOS = Platform.OS;
    Platform.OS = 'ios';
    
    // Même sur un grand écran, devrait être considéré comme mobile sur iOS/Android
    Dimensions.get.mockReturnValue({ width: 1200, height: 800 });
    
    const { result } = renderHook(() => useResponsive());
    
    expect(result.current.deviceType).toBe(DEVICE_TYPES.MOBILE);
    expect(result.current.isMobile).toBe(true);
    
    // Restaurer la plateforme d'origine
    Platform.OS = originalOS;
  });
});