import LoginPage from '../../support/pages/LoginPage';
import DashboardPage from '../../support/pages/DashboardPage';

describe('Connexion avec double authentification (2FA) - Code valide', () => {
  const loginPage = new LoginPage();
  const dashboardPage = new DashboardPage();

  beforeEach(() => {
    cy.visit('http://127.0.0.1:8080/index.html'); // Visiter la page d'accueil (connexion)
  });

  it('Doit se connecter avec un code 2FA valide', function () {
    cy.fixture('users').then((users) => {
      const user = users['2faUser']; // Utilisateur avec code 2FA valide

      loginPage.login(user.email, user.password);
      loginPage.twoFAScreen().should('be.visible');
      loginPage.enterTwoFACode(user.code2FA);
      loginPage.submitTwoFACodeButton().click();

      dashboardPage.verifyGreeting('Marie');
    });
  });
});

describe('Connexion avec double authentification (2FA) - Code invalide', () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    cy.visit('http://127.0.0.1:8080/index.html'); // Visiter la page d'accueil (connexion)
  });

  it('Doit afficher un message d\'erreur pour un code 2FA incorrect', function () {
    cy.fixture('users').then((users) => {
      cy.fixture('error-message').then((errors) => {
        const user = users.invalid2faUser; // Utilisateur 2FA invalide
        const errorMessage = errors['2fa'].invalidCode; // Message "Code de vérification incorrect"

        // Connexion avec email et mot de passe
        loginPage.login(user.email, user.password);

        // Vérifier que la page 2FA est affichée
        loginPage.twoFAScreen().should('be.visible');

        // Saisir le code 2FA incorrect depuis la fixture
        loginPage.enterTwoFACode(user.code2FA);

        // Cliquer sur le bouton "Vérifier"
        loginPage.submitTwoFACodeButton().click();

        // Vérification du message d'erreur
        cy.get('#2fa-error')
          .should('be.visible')
          .and('contain.text', errorMessage);
      });
    });
  });
});

