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

Pour chaque type de test, nous avons défini un ensemble de scénarios de test précis:

### Tests unitaires backend

| ID | Scénario | Vérification | Prérequis | Étapes | Résultat attendu |
|----|----------|--------------|-----------|--------|------------------|
| TU-001 | L'utilisateur "user123" (id=123) tente de supprimer son propre diagnostic (id=1) | Suppression d'un diagnostic existant | Un diagnostic existant avec id=1 et userId=123 | 1. Simuler une requête avec l'ID du diagnostic=1 et utilisateur id=123<br>2. Appeler la méthode deleteDiagnostic | Le diagnostic est supprimé et statut 200 retourné |
| TU-002 | L'utilisateur "user123" (id=123) tente de supprimer un diagnostic inexistant (id=999) | Suppression d'un diagnostic inexistant | - | 1. Simuler une requête avec ID=999 inexistant<br>2. Appeler la méthode deleteDiagnostic | Statut 404 retourné avec message "Diagnostic non trouvé" |
| TU-003 | Lors de la suppression d'un diagnostic (id=1), la base de données est inaccessible | Suppression avec erreur serveur | Base de données configurée pour échouer | 1. Configurer le mock de Diagnostic.findOne pour rejeter avec une erreur "Database error"<br>2. Appeler la méthode deleteDiagnostic | Statut 500 retourné avec message d'erreur serveur |
| TU-004 | L'utilisateur "content_creator" (id=456) crée un article sur la santé mentale | Création d'un contenu | L'utilisateur est authentifié | 1. Simuler une requête avec title="Comprendre l'anxiété", body="...", type="article", isPublic=true<br>2. Appeler la méthode createContent | Le contenu est créé et statut 201 retourné avec l'objet contenu dans la réponse |
| TU-005 | L'utilisateur "reader" (id=789) aime un article (id=42) sur la méditation | Ajout d'un like à un contenu | Un contenu existant avec id=42 | 1. Simuler une requête avec contentId=42 et type="like"<br>2. Appeler handleContentInteraction | Interaction créée et statut 201 retourné avec message "like ajouté avec succès" |
| TU-006 | L'utilisateur "user456" (id=456) ajoute un like à un diagnostic de stress (id=22) | Ajout d'un like à un diagnostic | Un diagnostic existant avec id=22 | 1. Simuler une requête avec diagnosticId=22 et type="like"<br>2. Appeler handleDiagnosticInteraction | Interaction créée et statut 201 retourné avec success=true |
| TU-007 | L'utilisateur "user123" (id=123) tente de supprimer un contenu (id=55) appartenant à un autre utilisateur | Vérification des permissions de suppression | Contenu existant avec id=55 et userId=456 | 1. Simuler une requête avec contentId=55 et utilisateur id=123<br>2. Appeler la méthode deleteContent | Statut 403 retourné avec message "Vous n'avez pas le droit de supprimer ce contenu" |
| TU-008 | L'utilisateur "admin" (id=1, role="admin") tente d'accéder à une route protégée par le middleware isAdmin | Vérification du middleware administrateur | Utilisateur avec role="admin" | 1. Configurer req.user avec {id: 1, role: "admin"}<br>2. Appeler le middleware isAdmin<br>3. Vérifier que next() est appelé | La fonction next() est appelée sans erreur |
| TU-009 | L'utilisateur normal "user456" (id=456, role="user") tente d'accéder à une route protégée par le middleware isAdmin | Vérification des restrictions d'accès administrateur | Utilisateur avec role="user" | 1. Configurer req.user avec {id: 456, role: "user"}<br>2. Appeler le middleware isAdmin | Statut 403 retourné avec message "Accès réservé aux administrateurs" |
| TU-010 | L'utilisateur "user123" (id=123) tente de mettre à jour un contenu (id=77) lui appartenant | Mise à jour d'un contenu par son propriétaire | Contenu existant avec id=77 et userId=123 | 1. Simuler une requête avec contentId=77, title="Nouveau titre", body="Nouveau contenu"<br>2. Appeler la méthode updateContent | Contenu mis à jour et statut 200 retourné |

### Tests fonctionnels backend

| ID | Scénario | Vérification | Prérequis | Étapes | Résultat attendu |
|----|----------|--------------|-----------|--------|------------------|
| TF-001 | L'utilisateur "health_enthusiast" se connecte et consulte ses diagnostics de santé | Récupération des diagnostics utilisateur | Utilisateur authentifié avec diagnostics existants | 1. Se connecter avec les identifiants de "health_enthusiast"<br>2. Envoyer une requête GET à /api/diagnostics/user<br>3. Vérifier la réponse | Liste des diagnostics retournée avec statut 200 |
| TF-002 | L'utilisateur "stress_student" complète un diagnostic de stress Holmes-Rahe avec un score de 250 points | Création d'un diagnostic | Utilisateur authentifié | 1. Se connecter avec les identifiants de "stress_student"<br>2. Envoyer une requête POST à /api/diagnostics avec title="Mon niveau de stress", responses={...}, score=250, isHolmesRahe=true<br>3. Vérifier la réponse | Diagnostic créé avec statut 201, riskLevel="moderate" automatically set |
| TF-003 | L'utilisateur "mental_health_advocate" aime un article (id=33) sur la pleine conscience | Like d'un contenu | Utilisateur authentifié, contenu existant id=33 | 1. Se connecter avec les identifiants de "mental_health_advocate"<br>2. Envoyer une requête POST à /api/interactions/content avec contentId=33, type="like"<br>3. Vérifier la réponse | Like ajouté avec statut 201, stats du contenu mis à jour |
| TF-004 | Un visiteur anonyme consulte les statistiques d'interaction d'un article populaire (id=99) | Consultation des statistiques d'interaction | Contenu public avec id=99 ayant des interactions | 1. Sans authentification, envoyer une requête GET à /api/interactions/content/99/stats<br>2. Vérifier la réponse | Statistiques (likes=42, views=1024, etc.) retournées avec statut 200 |
| TF-005 | L'utilisateur "regular_user" (role="user") tente d'accéder à la liste de tous les utilisateurs | Tentative d'accès à une ressource administrative | Utilisateur avec role="user" | 1. Se connecter avec les identifiants de "regular_user"<br>2. Envoyer une requête GET à /api/admin/users<br>3. Vérifier la réponse | Statut 403 retourné avec message "Accès réservé aux administrateurs" |
| TF-006 | L'administrateur "admin_moderator" modère un contenu signalé (id=45) | Modération de contenu | Utilisateur avec role="admin", contenu existant id=45 | 1. Se connecter avec les identifiants de "admin_moderator"<br>2. Envoyer une requête PUT à /api/contents/admin/moderate/45 avec status="rejected", moderationComment="Contenu inapproprié"<br>3. Vérifier la réponse | Contenu modéré avec statut 200, status mis à jour |
| TF-007 | L'utilisateur "content_creator" (id=456) supprime son propre diagnostic de stress (id=88) | Suppression d'un diagnostic | Diagnostic existant avec id=88 et userId=456 | 1. Se connecter avec les identifiants de "content_creator"<br>2. Envoyer une requête DELETE à /api/diagnostics/88<br>3. Vérifier la réponse | Diagnostic supprimé avec statut 200, message de succès |
| TF-008 | L'utilisateur "user789" tente d'accéder à un contenu privé (id=111) d'un autre utilisateur | Tentative d'accès à un contenu privé | Contenu existant avec id=111, isPublic=false | 1. Se connecter avec les identifiants de "user789"<br>2. Envoyer une requête GET à /api/contents/111<br>3. Vérifier la réponse | Statut 403 retourné avec message "Vous n'avez pas accès à ce contenu" |

### Tests frontend

| ID | Scénario | Vérification | Prérequis | Étapes | Résultat attendu |
|----|----------|--------------|-----------|--------|------------------|
| TF-UI-001 | Affichage d'un article avec le tag "méditation" et l'auteur "mindfulness_expert" | Rendu du composant ContentCard | Store Redux configuré, données de contenu | 1. Rendre le composant ContentCard avec des props incluant title="Méditation guidée", author="mindfulness_expert", tags=["médit
|----|----------|-----------|--------|------------------|
| TE2E-001 | Parcours utilisateur complet | Application démarrée | 1. Inscription<br>2. Connexion<br>3. Création diagnostic<br>4. Création contenu<br>5. Interactions | Toutes les étapes réussissent |
| TE2E-002 | Consultation des diagnostics | Utilisateur avec diagnostics | 1. Connexion<br>2. Navigation vers diagnostics<br>3. Consultation d'un diagnostic | Diagnostic affiché correctement |
| TE2E-003 | Interactions avec contenu | Utilisateur authentifié | 1. Connexion<br>2. Navigation vers contenus<br>3. Like d'un contenu | Like enregistré et affiché |