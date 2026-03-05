import LoginPage from '../../support/pages/LoginPage';
import DashboardPage from '../../support/pages/DashboardPage';

describe('Connexion - Se souvenir de moi', () => {

  const loginPage = new LoginPage();
  const dashboardPage = new DashboardPage();

  beforeEach(() => {
    cy.visit('http://127.0.0.1:8080/index.html');
  });

  it('Doit rester connecté après rafraîchissement si "Se souvenir de moi" est coché', () => {

    cy.fixture('users').then((users) => {
      const user = users.loginUser;

      // ---------------------------
      // Remplir le formulaire de login
      // ---------------------------
      loginPage.emailInput()
        .should('be.visible')
        .type(user.email);

      loginPage.passwordInput()
        .should('be.visible')
        .type(user.password);

      // ---------------------------
      // Cocher "Se souvenir de moi"
      // ---------------------------
      cy.get('[data-testid="checkbox-remember"]')
        .should('be.visible')
        .check()
        .should('be.checked');

      // ---------------------------
      // Se connecter
      // ---------------------------
      loginPage.loginButton()
        .scrollIntoView()
        .click({ force: true });

      // ---------------------------
      // Vérifier connexion réussie
      // ---------------------------
      dashboardPage.dashboardGreeting()
        .should('be.visible')
        .and('contain.text', 'Bonjour');

    });
  });

});
