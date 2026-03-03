import LoginPage from '../../support/pages/LoginPage';
import DashboardPage from '../../support/pages/DashboardPage';

describe('Lister les factures sur le site', () => {
  const loginPage = new LoginPage();
  const dashboardPage = new DashboardPage();

  beforeEach(function () {
    // Charger la fixture transfer.json où se trouve balanceUser
    cy.fixture('transfer').as('transferData'); 
    cy.visit('http://127.0.0.1:8080/index.html'); // page de connexion
  });

  it('Doit afficher toutes les factures avec fournisseur, référence, montant et date', function () {
    const user = this.transferData.balanceUser; // <-- utiliser transferData au lieu de usersData

    // ---------------------------
    // Connexion
    // ---------------------------
    loginPage.login(user.email, user.password);

    // Vérification message de bienvenue
    dashboardPage.verifyGreeting('Utilisateur 👋');

    // ---------------------------
    // Cliquer sur l'onglet Factures
    // ---------------------------
    cy.get('[data-testid="tab-bills"]').click();

    // Vérifier qu'on est sur la page Factures
    cy.get('h2.card-title')
      .contains('Factures à payer')
      .should('be.visible');

    // ---------------------------
    // Vérifier le nombre de factures
    // ---------------------------
    cy.get('.bill-provider').should('have.length', 4);

    // ---------------------------
    // Vérifier les détails de chaque facture
    // ---------------------------
    const expectedBills = [
      { provider: 'EDF', reference: 'EDF-2025-001234', amount: '156.78 €', due: '25 janvier 2025' },
      { provider: 'Orange', reference: 'ORG-2025-567890', amount: '49.99 €', due: '20 janvier 2025' },
      { provider: 'Assurance Auto', reference: 'AXA-2025-112233', amount: '89.00 €', due: '28 janvier 2025' },
      { provider: 'Eau de Paris', reference: 'EAU-2025-445566', amount: '34.50 €', due: '5 février 2025' },
    ];

    expectedBills.forEach((bill, index) => {
      cy.get('.bill-provider').eq(index).should('contain.text', bill.provider);
      cy.get('.bill-reference').eq(index).should('contain.text', bill.reference);
      cy.get('.bill-amount').eq(index).should('contain.text', bill.amount);
      cy.get('.bill-due').eq(index).should('contain.text', bill.due);
    });
  });
});