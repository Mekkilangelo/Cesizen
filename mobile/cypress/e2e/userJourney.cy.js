describe('Parcours utilisateur complet', () => {
  // Test data
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    username: `testuser-${Date.now()}`,
    password: 'Password123!'
  };

  // Avant chaque test, nous visitons la page d'accueil
  beforeEach(() => {
    // Intercepter les requêtes API pour les simuler
    cy.intercept('POST', '/api/auth/register').as('register');
    cy.intercept('POST', '/api/auth/login').as('login');
    cy.intercept('GET', '/api/auth/profile').as('getProfile');
    cy.intercept('GET', '/api/diagnostics/user').as('getUserDiagnostics');
    cy.intercept('GET', '/api/contents').as('getContents');
    
    // Visiter la page d'accueil
    cy.visit('/');
  });

  it('Devrait permettre l\'inscription, la connexion et la navigation', () => {
    // 1. Commencer par l'inscription
    cy.get('[data-testid=guest-register-button]').click();
    cy.location('pathname').should('include', '/register');
    
    // Remplir le formulaire d'inscription
    cy.get('[data-testid=register-username]').type(testUser.username);
    cy.get('[data-testid=register-email]').type(testUser.email);
    cy.get('[data-testid=register-password]').type(testUser.password);
    cy.get('[data-testid=register-confirm-password]').type(testUser.password);
    cy.get('[data-testid=register-button]').click();
    
    // Attendre la réponse d'inscription
    cy.wait('@register').then((interception) => {
      expect(interception.response.statusCode).to.eq(201);
    });
    
    // 2. Vérifier que nous sommes connectés et redirigés vers la page d'accueil
    cy.location('pathname').should('eq', '/home');
    cy.get('[data-testid=username-display]').should('contain', testUser.username);
    
    // 3. Se déconnecter
    cy.get('[data-testid=user-menu]').click();
    cy.get('[data-testid=logout-button]').click();
    
    // 4. Se connecter avec les identifiants créés
    cy.get('[data-testid=guest-login-button]').click();
    cy.location('pathname').should('include', '/login');
    
    cy.get('[data-testid=login-email]').type(testUser.email);
    cy.get('[data-testid=login-password]').type(testUser.password);
    cy.get('[data-testid=login-button]').click();
    
    // Attendre la réponse de connexion
    cy.wait('@login').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });
    
    // Vérifier que nous sommes connectés et redirigés vers la page d'accueil
    cy.location('pathname').should('eq', '/home');
    
    // 5. Naviguer vers la page de diagnostic
    cy.get('[data-testid=diagnostic-tab]').click();
    cy.location('pathname').should('include', '/diagnostic');
    
    // 6. Commencer un nouveau diagnostic Holmes-Rahe
    cy.get('[data-testid=start-diagnostic-button]').click();
    cy.location('pathname').should('include', '/holmes-rahe');
    
    // 7. Répondre à quelques questions du diagnostic
    cy.get('[data-testid=diagnostic-question]').should('be.visible');
    cy.get('[data-testid=question-option-yes]').click();
    cy.get('[data-testid=next-question-button]').click();
    
    // Continuer à répondre à quelques questions
    cy.get('[data-testid=question-option-no]').click();
    cy.get('[data-testid=next-question-button]').click();
    
    // 8. Naviguer vers la page de contenu
    cy.get('[data-testid=content-tab]').click();
    cy.location('pathname').should('include', '/content');
    
    // Attendre le chargement des contenus
    cy.wait('@getContents');
    
    // 9. Vérifier qu'au moins un contenu est affiché
    cy.get('[data-testid=content-card]').should('have.length.at.least', 1);
    
    // 10. Cliquer sur un contenu pour voir ses détails
    cy.get('[data-testid=content-card]').first().click();
    cy.location('pathname').should('include', '/content/');
    
    // 11. Interagir avec le contenu (like)
    cy.get('[data-testid=like-button]').click();
    
    // 12. Naviguer vers le profil
    cy.get('[data-testid=profile-tab]').click();
    cy.location('pathname').should('include', '/profile');
    
    // 13. Vérifier que les informations du profil sont correctes
    cy.get('[data-testid=profile-username]').should('contain', testUser.username);
    cy.get('[data-testid=profile-email]').should('contain', testUser.email);
  });
  
  it('Devrait afficher les diagnostics récents de l\'utilisateur', () => {
    // Se connecter d'abord
    cy.get('[data-testid=guest-login-button]').click();
    cy.get('[data-testid=login-email]').type(testUser.email);
    cy.get('[data-testid=login-password]').type(testUser.password);
    cy.get('[data-testid=login-button]').click();
    
    // Attendre la réponse de connexion
    cy.wait('@login');
    
    // Aller à la page des diagnostics
    cy.get('[data-testid=diagnostic-tab]').click();
    
    // Attendre le chargement des diagnostics
    cy.wait('@getUserDiagnostics');
    
    // Vérifier qu'au moins un diagnostic est affiché (si l'utilisateur en a)
    cy.get('[data-testid=diagnostic-card]').should('exist');
    
    // Cliquer sur un diagnostic pour voir ses détails
    cy.get('[data-testid=diagnostic-card]').first().click();
    cy.location('pathname').should('include', '/diagnostic/');
    
    // Vérifier que les détails du diagnostic sont affichés
    cy.get('[data-testid=diagnostic-score]').should('be.visible');
    cy.get('[data-testid=diagnostic-stress-level]').should('be.visible');
  });
});