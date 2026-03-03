import LoginPage from '../../support/pages/LoginPage';
import DashboardPage from '../../support/pages/DashboardPage';
import TransferPage from '../../support/pages/TransferPage';

describe('Virement vers un bénéficiaire tiers', () => {
  const loginPage = new LoginPage();
  const dashboardPage = new DashboardPage();
  const transferPage = new TransferPage();

  beforeEach(function () {
    // Charger la fixture pour balanceUser
    cy.fixture('transfer').as('transferData'); 

    // Charger la fixture des bénéficiaires
    cy.fixture('beneficiaries').as('beneficiariesData'); 

    // Visiter la page de connexion
    cy.visit('http://127.0.0.1:8080/index.html'); 
  });

  it('Doit afficher un message d\'erreur pour un IBAN invalide', function () {
    const user = this.transferData.balanceUser; // <-- correction ici
    const invalidBeneficiary = this.beneficiariesData[4].invalidBeneficiary;

    // ---------------------------
    // Connexion
    // ---------------------------
    loginPage.login(user.email, user.password);

    // Vérification message de bienvenue
    dashboardPage.verifyGreeting('Utilisateur 👋');

    // ---------------------------
    // Aller sur l'onglet Virements
    // ---------------------------
    transferPage.transferTab().click();
    transferPage.transferTitle().should('be.visible');

    // ---------------------------
    // Ajouter un bénéficiaire avec IBAN invalide
    // ---------------------------
    transferPage.clickTransferToThirdParty();

    cy.get('[data-testid="btn-add-beneficiary"]')
      .should('be.visible')
      .click();

    cy.get('h3.modal-title')
      .contains('Ajouter un bénéficiaire')
      .should('be.visible');

    cy.get('[data-testid="input-beneficiary-name"]')
      .should('be.visible')
      .type(invalidBeneficiary.name)
      .should('have.value', invalidBeneficiary.name);

    cy.get('[data-testid="input-beneficiary-iban"]')
      .should('be.visible')
      .type(invalidBeneficiary.iban)
      .should('have.value', invalidBeneficiary.iban);

    cy.get('[data-testid="btn-save-beneficiary"]')
      .should('be.visible')
      .click();

    // Vérifier que l'alerte IBAN invalide s'affiche
    cy.on('window:alert', (alertText) => {
      expect(alertText).to.equal('IBAN invalide. Format attendu: FR76 XXXX XXXX XXXX XXXX XXXX XXX');
    });
  });
});