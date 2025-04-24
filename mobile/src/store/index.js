import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import des réducteurs
import authReducer from './authSlice';
import contentReducer from './contentSlice';
import diagnosticReducer from './diagnosticSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'] // Seul l'état d'authentification est persisté
};

const rootReducer = combineReducers({
  auth: authReducer,
  contents: contentReducer,
  diagnostics: diagnosticReducer, // Ajout du réducteur diagnostics
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);