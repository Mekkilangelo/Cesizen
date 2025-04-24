# Plan de Tests Cesizen

Ce document décrit la stratégie de tests mise en place pour le projet Cesizen, couvrant à la fois le backend (API) et le frontend (Mobile/Web).

## Table des matières

1. [Types de tests](#types-de-tests)
2. [Tests Backend](#tests-backend)
3. [Tests Frontend](#tests-frontend)
4. [Exécution des tests](#exécution-des-tests)
5. [Intégration Continue](#intégration-continue)

## Types de tests

Notre stratégie de test comprend trois niveaux principaux:

### Tests unitaires
Tests qui vérifient le bon fonctionnement des unités individuelles de code (fonctions, méthodes, classes).

### Tests fonctionnels
Tests qui vérifient le bon fonctionnement des fonctionnalités complètes du système, impliquant plusieurs composants.

### Tests de non-régression
Tests qui s'assurent que les modifications apportées au code n'affectent pas négativement les fonctionnalités existantes.

## Tests Backend

Les tests backend sont organisés dans le dossier `server/tests/` et sont divisés en:

### Tests unitaires

Localisés dans `server/tests/unit/`, ces tests vérifient le bon fonctionnement des contrôleurs et middlewares:
- `diagnosticController.test.js`: Tests pour la gestion des diagnostics
- `contentController.test.js`: Tests pour la gestion des contenus
- `auth.middleware.test.js`: Tests pour le middleware d'authentification
- `interactionController.test.js`: Tests pour la gestion des interactions (like, dislike, favoris)

### Tests d'intégration

Localisés dans `server/tests/integration/`, ces tests vérifient le bon fonctionnement des routes API:
- `routes/diagnosticRoutes.test.js`: Tests pour les routes de diagnostic
- `routes/contentRoutes.test.js`: Tests pour les routes de contenu
- `routes/interactionRoutes.test.js`: Tests pour les routes d'interaction
- `models/User.test.js`: Tests pour le modèle utilisateur
- `controllers/authController.test.js`: Tests pour le contrôleur d'authentification

### Tests End-to-End

Localisés dans `server/tests/e2e/`, ces tests simulent des parcours utilisateur complets:
- `userJourney.test.js`: Test d'un parcours utilisateur de base
- `userJourneyNonRegression.test.js`: Test complet pour non-régression

## Tests Frontend

Les tests frontend sont organisés dans le dossier `mobile/src/__tests__/` et sont divisés en:

### Tests unitaires React

Localisés dans `mobile/src/__tests__/components/`, ces tests vérifient les composants React:
- `ContentCard.test.js`: Tests pour le composant d'affichage des cartes de contenu

### Tests Redux

Localisés dans `mobile/src/__tests__/redux/`, ces tests vérifient les reducers et actions Redux:
- `authSlice.test.js`: Tests pour la gestion de l'authentification dans Redux

### Tests End-to-End (Cypress)

Localisés dans `mobile/cypress/e2e/`, ces tests simulent des parcours utilisateur complets via l'interface:
- `userJourney.cy.js`: Test du parcours complet d'inscription, connexion et navigation

## Exécution des tests

### Backend

Pour exécuter les tests backend:

```bash
# À la racine du dossier server
npm test                 # Exécute tous les tests
npm run test:unit        # Exécute uniquement les tests unitaires
npm run test:integration # Exécute uniquement les tests d'intégration
npm run test:e2e         # Exécute uniquement les tests e2e
npm run test:coverage    # Exécute les tests avec rapport de couverture
```

### Frontend

Pour exécuter les tests frontend:

```bash
# À la racine du dossier mobile
npm test                 # Exécute tous les tests Jest
npm run test:watch       # Exécute les tests en mode watch
npm run test:coverage    # Exécute les tests avec rapport de couverture
npm run cy:open          # Ouvre l'interface Cypress (nécessite que l'application soit en cours d'exécution)
npm run cy:run           # Exécute les tests Cypress en mode headless
```

Pour les tests Cypress, assurez-vous que l'application est en cours d'exécution:

```bash
# Dans un premier terminal
npm run web              # Démarre la version web de l'application

# Dans un second terminal
npm run cy:open          # Ouvre l'interface Cypress
```

## Intégration Continue

Nous recommandons d'utiliser GitHub Actions pour exécuter automatiquement les tests à chaque push. Un exemple de configuration se trouverait dans le fichier `.github/workflows/test.yml`.

## Cahier de Tests

Pour chaque type de test, nous avons défini un ensemble de scénarios de test:

### Tests unitaires backend

| ID | Scénario | Prérequis | Étapes | Résultat attendu |
|----|----------|-----------|--------|------------------|
| TU-001 | Suppression d'un diagnostic existant | Un diagnostic existant | 1. Simuler une requête avec l'ID du diagnostic<br>2. Appeler la méthode deleteDiagnostic | Le diagnostic est supprimé et statut 200 retourné |
| TU-002 | Suppression d'un diagnostic inexistant | - | 1. Simuler une requête avec ID inexistant<br>2. Appeler la méthode deleteDiagnostic | Statut 404 retourné |
| TU-003 | Suppression avec erreur serveur | - | 1. Simuler une erreur DB<br>2. Appeler la méthode deleteDiagnostic | Statut 500 retourné |
| TU-004 | Création d'un contenu | - | 1. Simuler une requête avec données valides<br>2. Appeler la méthode createContent | Le contenu est créé et statut 201 retourné |
| TU-005 | Ajout d'un like à un contenu | Un contenu existant | 1. Simuler une requête avec contentId et type=like<br>2. Appeler handleContentInteraction | Interaction créée et statut 201 retourné |
| TU-006 | Ajout d'un like à un diagnostic | Un diagnostic existant | 1. Simuler une requête avec diagnosticId et type=like<br>2. Appeler handleDiagnosticInteraction | Interaction créée et statut 201 retourné |

### Tests fonctionnels backend

| ID | Scénario | Prérequis | Étapes | Résultat attendu |
|----|----------|-----------|--------|------------------|
| TF-001 | Récupération des diagnostics utilisateur | Utilisateur authentifié | 1. Envoyer une requête GET à /api/diagnostics/user<br>2. Vérifier la réponse | Liste des diagnostics retournée avec statut 200 |
| TF-002 | Création d'un diagnostic | Utilisateur authentifié | 1. Envoyer une requête POST à /api/diagnostics<br>2. Vérifier la réponse | Diagnostic créé avec statut 201 |
| TF-003 | Like d'un contenu | Utilisateur authentifié, contenu existant | 1. Envoyer une requête POST à /api/interactions/content<br>2. Vérifier la réponse | Like ajouté avec statut 201 |
| TF-004 | Consultation des statistiques d'interaction | Contenu avec interactions | 1. Envoyer une requête GET à /api/interactions/content/:id/stats<br>2. Vérifier la réponse | Statistiques retournées avec statut 200 |

### Tests frontend

| ID | Scénario | Prérequis | Étapes | Résultat attendu |
|----|----------|-----------|--------|------------------|
| TF-UI-001 | Rendu du composant ContentCard | Store Redux configuré | 1. Rendre le composant ContentCard<br>2. Vérifier l'affichage des éléments | Tous les éléments sont affichés correctement |
| TF-UI-002 | Navigation vers le détail du contenu | Store et navigation configurés | 1. Cliquer sur une carte de contenu<br>2. Vérifier la navigation | Navigation effectuée vers la page de détail |
| TF-UI-003 | Affichage du badge favori | Contenu en favori | 1. Rendre le composant avec isFavorite=true<br>2. Vérifier l'affichage | Badge favori affiché |
| TF-REDUX-001 | Connexion utilisateur | Store configuré | 1. Dispatché l'action loginUser<br>2. Vérifier l'état | État mis à jour avec utilisateur connecté |
| TF-REDUX-002 | Déconnexion utilisateur | Utilisateur connecté | 1. Dispatché l'action logout<br>2. Vérifier l'état | État mis à jour avec utilisateur déconnecté |

### Tests E2E et de non-régression

| ID | Scénario | Prérequis | Étapes | Résultat attendu |
|----|----------|-----------|--------|------------------|
| TE2E-001 | Parcours utilisateur complet | Application démarrée | 1. Inscription<br>2. Connexion<br>3. Création diagnostic<br>4. Création contenu<br>5. Interactions | Toutes les étapes réussissent |
| TE2E-002 | Consultation des diagnostics | Utilisateur avec diagnostics | 1. Connexion<br>2. Navigation vers diagnostics<br>3. Consultation d'un diagnostic | Diagnostic affiché correctement |
| TE2E-003 | Interactions avec contenu | Utilisateur authentifié | 1. Connexion<br>2. Navigation vers contenus<br>3. Like d'un contenu | Like enregistré et affiché |