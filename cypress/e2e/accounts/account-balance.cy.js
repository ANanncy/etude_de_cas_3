import LoginPage from '../../support/pages/LoginPage';
import DashboardPage from '../../support/pages/DashboardPage';

describe('Affichage du solde multi-compte', () => {
  const loginPage = new LoginPage();
  const dashboardPage = new DashboardPage();

  beforeEach(function () {
    // Charger la fixture
    cy.fixture('users').as('usersData');

    // Visiter la page de connexion avant chaque test
    cy.visit('http://127.0.0.1:8080/index.html');
  });

  it('Doit afficher le solde du compte courant, du Livret A et le solde total', function () {
    const user = this.usersData.balanceUser;

    // ---------------------------
    // Connexion
    // ---------------------------
    loginPage.login(user.email, user.password);

    // ---------------------------
    // Vérification du message de bienvenue
    // ---------------------------
    dashboardPage.verifyGreeting('Utilisateur 👋');

    // ---------------------------
    // Vérification des soldes individuels
    // ---------------------------
    dashboardPage.verifyAccountBalances(
      user.currentAccountBalance,
      user.savingsAccountBalance
    );

    // ---------------------------
    // Vérification du solde total multi-compte
    // ---------------------------
    cy.get('span.total-balance strong')
      .should('be.visible')
      .and('contain.text', user.totalBalance);
  });
});
