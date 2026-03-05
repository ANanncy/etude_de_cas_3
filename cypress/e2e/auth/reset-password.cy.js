import LoginPage from '../../support/pages/LoginPage';

describe('Réinitialisation de mot de passe - Cas passant et cas d\'erreur', () => {

  const loginPage = new LoginPage();

  beforeEach(() => {
    cy.visit('http://127.0.0.1:8080/index.html');  // Visiter la page de connexion
    cy.fixture('success-message').as('successMessage'); // Charger la fixture du message de succès
  });

  // Test du cas de réinitialisation avec un lien valide
  it('Doit réinitialiser le mot de passe avec un lien de réinitialisation', function () {
    cy.fixture('users').then((users) => {
      const user = users.resetPasswordUser;

      // Étape 1 : cliquer sur "Mot de passe oublié ?"
      loginPage.forgotPasswordLink()
        .should('be.visible')
        .click();

      // Vérifier que le titre "Mot de passe oublié" est visible
      loginPage.forgotPasswordTitle().should('be.visible');

      // Étape 2 : saisir l'email
      loginPage.resetEmailInput()
        .should('be.visible')
        .type(user.email);

      // Étape 3 : cliquer sur "Envoyer un lien"
      loginPage.sendResetLinkButton().click();

      // Étape 4 : vérifier le message de succès
      const successMessage = this.successMessage.resetPassword.success.replace("{email}", user.email); // Remplacer {email} par l'email de l'utilisateur

      loginPage.resetSuccessMessage()
        .should('be.visible')
        .and('contain.text', successMessage); // Utilisation du message de succès depuis la fixture
    });
  });

  // Test pour un email invalide
  it('Doit afficher un message d\'erreur pour un email invalide', function () {
    cy.fixture('users').then((users) => {
      cy.fixture('error-message').then((errors) => {
        const invalidEmail = users.invalidResetPasswordUser.email; // Utilisation de l'email invalide de la fixture
        const errorMessage = errors.resetPassword.invalidEmail; // Récupération du message d'erreur depuis la fixture

        // Étape 1 : cliquer sur "Mot de passe oublié ?"
        loginPage.forgotPasswordLink()
          .should('be.visible')
          .click();

        // Vérifier que le titre "Mot de passe oublié" est visible
        loginPage.forgotPasswordTitle().should('be.visible');

        // Étape 2 : saisir un email invalide
        loginPage.resetEmailInput()
          .should('be.visible')
          .type(invalidEmail);

        // Étape 3 : cliquer sur "Envoyer un lien"
        loginPage.sendResetLinkButton().click();

        // Vérifier le message d'erreur
        cy.get('#reset-error')  
          .should('be.visible')
          .and('contain.text', errorMessage);  //depuis la fixture
      });
    });
  });

});
