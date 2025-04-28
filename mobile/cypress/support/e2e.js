// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
// import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Configuration globale pour les tests Cypress
Cypress.on('uncaught:exception', (err, runnable) => {
  // Retourner false empêche Cypress d'échouer le test en cas d'erreur non gérée
  // Cela peut être utile lors des tests sur React Native Web où certaines erreurs
  // peuvent se produire en raison de l'environnement web simulé
  return false;
});

// Augmenter le timeout pour les opérations d'attente
Cypress.config('defaultCommandTimeout', 10000);