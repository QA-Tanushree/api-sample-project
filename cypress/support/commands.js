// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// cypress/support/commands.js
const path = require('path');
const tokenFilePath = path.join(__dirname, '..', 'fixtures', 'value', 'token.json');

Cypress.Commands.add('getAuthorizationToken', (forceRefresh = false) => {
  if (!forceRefresh) {
    const token = Cypress.env('authorizationHeader');
    if (token) {
      return cy.wrap(token);
    }
  }

  return cy.request({
    method: 'POST',
    url: 'https://sandbox.dmoney.com.bd:3033/Dmoney/Token',
    headers: {
      'Authorization': 'Basic E8xlkWsSjZKBZ8yQ6VjaQIUM9tUfo/bPdrOy+BATiwc=',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      grant_type: 'password',
    },
  }).then((response) => {
    if (response.status === 200) {
      const accessToken = response.body.access_token;
      const authHeader = `Bearer ${accessToken}`;
      Cypress.env('authorizationHeader', authHeader);

      cy.task('writeToken', authHeader).then(() => {
        return cy.wrap(authHeader);
      });
    } else {
      throw new Error(`Failed to obtain access token, status code: ${response.status}`);
    }
  });
});