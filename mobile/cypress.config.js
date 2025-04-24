const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:19006', // URL de développement Expo Web
    setupNodeEvents(on, config) {
      // implémenter des gestionnaires d'événements de nœuds ici
    },
  },
});