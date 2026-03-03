// cypress/support/pages/TransactionsPage.js
class TransactionsPage {

    recentTransactionsTitle() {
        return cy.get('h3.card-title').contains('Dernières transactions');
    }

    transactionsList() {
        return cy.get('.transaction-description');
    }

    transactionDescription(index) {
        return cy.get('.transaction-description').eq(index);
    }

    transactionAmount(index) {
        return cy.get('.transaction-amount').eq(index);
    }

    transactionDate(index) {
        return cy.get('.transaction-date').eq(index);
    }

    verifyTransaction(index, description, amount, date) {
        const normalize = (str) => str.trim().replace(/[\u00A0\u202F\u2009\u0020]+/g, ' ');

        this.transactionDescription(index)
            .invoke('text')
            .then((t) => { expect(normalize(t)).to.include(normalize(description)); });

        this.transactionAmount(index)
            .invoke('text')
            .then((t) => { expect(normalize(t)).to.equal(normalize(amount)); });

        this.transactionDate(index)
            .invoke('text')
            .then((t) => { expect(normalize(t)).to.include(normalize(date)); });
    }
}

export default TransactionsPage;
