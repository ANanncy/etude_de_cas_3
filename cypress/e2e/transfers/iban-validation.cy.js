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

  it('Doit effectuer un virement vers un bénéficiaire avec IBAN valide', function () {
    const user = this.transferData.balanceUser; // <-- correction ici
    const validBeneficiary = this.beneficiariesData[3].validBeneficiarytest;

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
    // Effectuer un virement vers un bénéficiaire
    // ---------------------------
    transferPage.clickTransferToThirdParty();

    cy.get('[data-testid="btn-add-beneficiary"]')
      .should('be.visible')
      .click();

    cy.get('h3.modal-title')
      .contains('Ajouter un bénéficiaire')
      .should('be.visible');

    // ---------------------------
    // Ajouter un bénéficiaire avec IBAN valide
    // ---------------------------
    cy.get('[data-testid="input-beneficiary-name"]')
      .should('be.visible')
      .type(validBeneficiary.name)
      .should('have.value', validBeneficiary.name);

    cy.get('[data-testid="input-beneficiary-iban"]')
      .should('be.visible')
      .type(validBeneficiary.iban)
      .invoke('val')
      .then((ibanValue) => {
        expect(ibanValue).to.not.equal('');

        const normalizedIban = String(ibanValue).replace(/\s+/g, '');
        expect(normalizedIban).to.match(/^FR76\d{23}$/);
        expect(normalizedIban.length).to.eq(27);
      });

    cy.get('[data-testid="btn-save-beneficiary"]')
      .should('be.visible')
      .click();

    cy.get('div.beneficiary-name')
      .contains(validBeneficiary.name)
      .should('be.visible');
  });
});
