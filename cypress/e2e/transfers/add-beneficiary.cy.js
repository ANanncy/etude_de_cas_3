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

  it('Doit effectuer un virement du compte courant vers un bénéficiaire', function () {
    const user = this.transferData.balanceUser; // <-- correction
    const validBeneficiary = this.beneficiariesData[2].validBeneficiary;

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
    // Effectuer le virement vers un bénéficiaire
    // ---------------------------
    transferPage.clickTransferToThirdParty();

    cy.get('[data-testid="btn-add-beneficiary"]')
      .should('be.visible')
      .click();

    cy.get('h3.modal-title')
      .contains('Ajouter un bénéficiaire')
      .should('be.visible');

    // ---------------------------
    // Ajouter un bénéficiaire
    // ---------------------------
    cy.get('[data-testid="input-beneficiary-name"]')
      .should('be.visible')
      .click()
      .type(validBeneficiary.name)
      .should('have.value', validBeneficiary.name);

    cy.get('[data-testid="input-beneficiary-iban"]')
      .should('be.visible')
      .click()
      .type(validBeneficiary.iban)
      .should('have.value', validBeneficiary.iban);

    cy.get('[data-testid="btn-save-beneficiary"]')
      .should('be.visible')
      .click();

    cy.get('div.beneficiary-name')
      .contains(validBeneficiary.name)
      .should('be.visible');
  });

  it('Doit annuler l’ajout d’un bénéficiaire', function () {
    const user = this.transferData.balanceUser; // <-- correction
    const beneficiary = this.beneficiariesData[2].validBeneficiary;

    // ---------------------------
    // Connexion
    // ---------------------------
    loginPage.login(user.email, user.password);
    dashboardPage.verifyGreeting('Utilisateur 👋');

    // ---------------------------
    // Aller sur l'onglet Virements
    // ---------------------------
    transferPage.transferTab().click();
    transferPage.transferTitle().should('be.visible');
    transferPage.clickTransferToThirdParty();

    // ---------------------------
    // Ouvrir la modale "Ajouter un bénéficiaire"
    // ---------------------------
    cy.get('[data-testid="btn-add-beneficiary"]')
      .should('be.visible')
      .click();

    cy.get('h3.modal-title')
      .contains('Ajouter un bénéficiaire')
      .should('be.visible');

    // ---------------------------
    // Remplir les champs
    // ---------------------------
    cy.get('[data-testid="input-beneficiary-name"]').type(beneficiary.name);
    cy.get('[data-testid="input-beneficiary-iban"]').type(beneficiary.iban);

    // ---------------------------
    // Cliquer sur "Annuler"
    // ---------------------------
    cy.get('[data-testid="btn-cancel-beneficiary"]')
      .should('be.visible')
      .click();

    // ---------------------------
    // Vérifications après annulation
    // ---------------------------
    cy.get('div.beneficiary-name')
      .contains(beneficiary.name)
      .should('not.exist');

    transferPage.transferTitle().should('be.visible');
  });
});