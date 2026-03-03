import LoginPage from '../../support/pages/LoginPage';
import TransactionsPage from '../../support/pages/TransactionsPage';

describe('Historique des transactions récentes - Compte Courant', () => {
  const loginPage = new LoginPage();
  const transactionsPage = new TransactionsPage();

  beforeEach(function () {
    // Charger les données depuis la fixture transfer.json
    cy.fixture('transfer').as('transferData');

    // Visiter la page de connexion
    cy.visit('http://127.0.0.1:8080/index.html');
  });

  it('Doit afficher les 3 dernières transactions du compte courant', function () {
    const user = this.transferData.balanceUser;

    // Se connecter
    loginPage.login(user.email, user.password);

    // Vérifier que la page principale affiche le texte "Bonjour, Utilisateur"
    cy.contains('Bonjour, Utilisateur').should('be.visible');

    // Cliquer sur le compte courant pour afficher les transactions
    cy.get('[data-testid="balance-4"]').click();

    // Vérifier que le titre "Dernières transactions" est visible
    transactionsPage.recentTransactionsTitle().should('be.visible');

    // Vérification dynamique des transactions
    user.transactions.forEach((tx, index) => {
      // Nettoyer le montant pour enlever espaces insécables ou retours à la ligne
      const cleanAmount = tx.amount.replace(/\s+/g, ' ').trim();

      transactionsPage.verifyTransaction(
        index,
        tx.description,
        cleanAmount, // utiliser le montant nettoyé
        tx.date
      );
    });
  });
});
