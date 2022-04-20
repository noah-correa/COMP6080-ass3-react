/* eslint-disable no-undef */
const email = 'cypress@test.com';
const password = 'password';
const name = 'cypress';

describe('Happy Path of Admin', () => {
  beforeEach(() => {
    cy.visit('localhost:3000');
    if (registered) {
      cy.get('input[id=email]').focus().type(email);
      cy.get('input[id=password]').focus().type(password);
      cy.get('button[id=login-button]').focus().click();
    }
  })

  const quizName = 'Cypress Test Quiz';
  let registered = false

  it('Successfully registers', () => {
    if (!registered) {
      cy.get('a[id=register-link]').focus().click();
      cy.get('input[id=email]').focus().type(email);
      cy.get('input[id=password]').focus().type(password);
      cy.get('input[id=password-confirm]').focus().type(password);
      cy.get('input[id=name]').focus().type(name);
      cy.get('button[id=register-button').focus().click();
      registered = true;
    }
  });

  // Creates a new game
  it('Creates a new game', () => {
    if (!cy.get('h4').contains(quizName)) {
      cy.get('button[id=show-new-quiz]').focus().click();
      cy.get('input[id=new-quiz-name]').focus().type(quizName);
      cy.get('button[id=new-quiz-button]').focus().click();
    }
  })

  // Starts a game
  it('Starts then stops a game then loads results', () => {
    cy.get(`div[name='${quizName}']`).within(() => {
      return cy.get('button[name=start]').focus().click();
    });
    cy.wait(1000);
    cy.get('button.btn-close').focus().click();
    // Ends a game
    cy.get(`div[name='${quizName}']`).within(() => {
      return cy.get('button[name=stop]').focus().click();
    });
    cy.wait(1000);
    // Loads results
    cy.get('button[name=show-results]').focus().click();
  })

  // Logs out
  it('Logs out successfully then logs back in', () => {
    cy.get('button#button-logout').focus().click();
    // Logs back in
    cy.get('input[id=email]').focus().type(email);
    cy.get('input[id=password]').focus().type(password);
    cy.get('button[id=login-button]').focus().click();
  })
});
