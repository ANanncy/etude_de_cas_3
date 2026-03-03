import LoginPage from '../../support/pages/LoginPage';
import DashboardPage from '../../support/pages/DashboardPage';

describe('Affichage du solde multi-compte', () => {
  const loginPage = new LoginPage();
  const dashboardPage = new DashboardPage();

  beforeEach(function () {
    // Charger la fixture
    cy.fixture('transfer').as('usersData');

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
    cy.get('[data-testid="balance-4"]')
      .should('be.visible')
      .invoke('text')
      .then((text) => {
        const value = parseFloat(text.replace(/\s|€/g, '').replace(',', '.'));
        expect(value).to.eq(user.currentAccountBalance);
      });

    cy.get('[data-testid="balance-5"]')
      .should('be.visible')
      .invoke('text')
      .then((text) => {
        const value = parseFloat(text.replace(/\s|€/g, '').replace(',', '.'));
        expect(value).to.eq(user.savingsAccountBalance);
      });

    // ---------------------------
    // Vérification du solde total
    // ---------------------------
    cy.get('span.total-balance strong')
      .should('be.visible')
      .invoke('text')
      .then((text) => {
        const value = parseFloat(text.replace(/\s|€/g, '').replace(',', '.'));
        expect(value).to.eq(user.totalBalance);
      });
  });
});
