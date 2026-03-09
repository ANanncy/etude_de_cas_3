import LoginPage from '../../support/pages/LoginPage';
import DashboardPage from '../../support/pages/DashboardPage';

describe('Mise à jour des factures à payer après paiement', () => {
  const loginPage = new LoginPage();
  const dashboardPage = new DashboardPage();

  beforeEach(() => {
    cy.fixture('users').as('usersData');  // Charger les données des utilisateurs
    cy.fixture('success-message').as('successMessage');  // Charger les messages de succès
    cy.visit('http://127.0.0.1:8080/index.html');
  });

  it('Ne doit plus afficher EDF dans les factures à payer et mettre à jour le compteur', function () {
    const user = this.usersData.loginUser;  // Utilisation du loginUser depuis users.json
    const successMessage = this.successMessage.billPayment.success;  // Utilisation du message de succès depuis success-message.json

    
    // Connexion
   
    loginPage.login(user.email, user.password);  // Connexion avec l'email et mot de passe de loginUser
    dashboardPage.verifyGreeting('Utilisateur 👋');

    
    // Aller sur l’onglet Factures
   
    cy.get('[data-testid="tab-bills"]').click();
    cy.get('h2.card-title')
      .contains('Factures à payer')
      .should('be.visible');

    
    // Payer la facture EDF
    
    cy.get('[data-testid="btn-pay-bill-1"]').click();
    cy.get('[data-testid="btn-confirm-payment"]').click();

    // Vérifier le message de succès
    cy.get('#bill-success', { timeout: 5000 })
      .should('be.visible')
      .and('contain.text', successMessage);  // Utilisation du message de succès de la fixture

    
    // Vérifier l’historique des factures payées
   
    cy.contains('h3.card-title', 'Factures payées')
      .should('be.visible');

    cy.get('.bill-status.paid')
      .should('be.visible')
      .and('contain.text', 'Payée');

    cy.get('.bill-provider')
      .contains('EDF')
      .should('be.visible');

    // Vérifier que EDF n’apparaît plus dans "Factures à payer"
    cy.contains('h2.card-title', 'Factures à payer')
      .parent()
      .within(() => {
        cy.contains('.bill-provider', 'EDF').should('not.exist');
      });

    // Vérifier le compteur
    cy.contains('span', '3 en attente')
      .should('be.visible');
  });
});
