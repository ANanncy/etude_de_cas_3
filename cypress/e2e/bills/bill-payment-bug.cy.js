import LoginPage from '../../support/pages/LoginPage';
import DashboardPage from '../../support/pages/DashboardPage';
import TransferPage from '../../support/pages/TransferPage';

describe('Virements entre comptes propres et gestion des factures à payer', () => {
  const loginPage = new LoginPage();
  const dashboardPage = new DashboardPage();
  const transferPage = new TransferPage();

  beforeEach(() => {
    // Charger les fixtures nécessaires
    cy.fixture('transfer').as('transferData');
    cy.fixture('success-message').as('successMessages');
    cy.fixture('users').as('usersData');
    cy.visit('http://127.0.0.1:8080/index.html'); // Page de connexion
  });

  // Test 1 : Effectuer un virement total de 5000 € du compte courant vers le Livret A
  it('Doit effectuer un virement total de 5000 euros du compte courant vers le Livret A', function () {
    const user = this.transferData.balanceUser; // Récupérer les données utilisateur
    const transferAmount = user.transferTotal.amount; // Montant du virement depuis la fixture
    const expectedCurrentAfter = user.transferTotal.expectedCurrentAfter; // Solde attendu du compte courant après virement
    const expectedSavingsAfter = user.transferTotal.expectedSavingsAfter; // Solde attendu du Livret A après virement

    // ---------------------------
    // Connexion
    // ---------------------------
    loginPage.login(user.email, user.password);

    // Vérification du message de bienvenue
    dashboardPage.verifyGreeting('Utilisateur 👋');

    // ---------------------------
    // Aller sur l'onglet Virements
    // ---------------------------
    transferPage.transferTab().click();

    // Vérification que la page de virement est ouverte
    transferPage.transferTitle().should('be.visible');

    // ---------------------------
    // Effectuer le virement total de 5000 €
    // ---------------------------
    transferPage.makeTransfer(
      'Compte Courant - 5 000,00 €',  // Compte débiteur
      'Livret A - 15 000,00 €',       // Compte créditeur
      transferAmount                   // Montant du virement
    );

    // ---------------------------
    // Vérifier le message de succès
    // ---------------------------
    cy.get('#transfer-success')
      .should('be.visible')
      .and('contain.text', this.successMessages.transfer.success);

    // ---------------------------
    // Aller sur l’onglet Factures 
    // ---------------------------

    cy.get('[data-testid="tab-bills"]', { timeout: 10000 })  // Attente explicite pour le bouton "Factures"
      .should('be.visible')
      .click();  // Cliquer sur l'onglet Factures

    // Vérification de la présence de l'onglet "Factures à payer"
    cy.get('h2.card-title')
      .contains('Factures à payer')
      .should('be.visible');  // Vérifier que la section des factures à payer est bien affichée

    // ---------------------------
    // Tenter de payer la facture EDF avec un solde de 0€
    // ---------------------------
    cy.get('[data-testid="btn-pay-bill-1"]').click();  // Sélectionner la facture EDF
    cy.get('[data-testid="btn-confirm-payment"]').click();  // Confirmer le paiement

    // ---------------------------
    // Vérifier que le paiement échoue (pas de message de succès)
    // ---------------------------
    cy.get('#bill-success', { timeout: 5000 }).should('not.exist');  // Le message de succès ne doit pas apparaître

    // Vérifier que la facture EDF est toujours dans les "Factures à payer"
    cy.contains('h2.card-title', 'Factures à payer')
      .parent()
      .within(() => {
        cy.contains('.bill-provider', 'EDF').should('be.visible');  // Vérifier qu'EDF est toujours présente
      });

    // Vérifier que le compteur des factures "en attente" reste correct
    cy.contains('span', '1 en attente')  // Vérifier que le compteur indique 1 facture en attente
      .should('be.visible');
  });
});