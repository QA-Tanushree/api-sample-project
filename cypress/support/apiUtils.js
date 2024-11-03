// cypress/support/apiUtils.js

// export const ApiRequestAndAssert = (url, payload, method) => {
//   return cy.request({
//     method: method,
//     url: url,
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: payload,
//     failOnStatusCode: false, // Allow the test to continue even if the status is not 2xx or 3xx
//   }).then((response) => {
//     cy.log('Response:', JSON.stringify(response.body)); // Log the entire response body
//     return cy.wrap(response); // Wrap the response in a Cypress command for further chaining
//   });
// };

// cypress/support/apiUtils.js
export const ApiRequestAndAssert = (url, payload, method) => {
  const makeRequest = (authToken) => {
    return cy.request({
      method: method,
      url: url,
      headers: {
        'Authorization': authToken,  // Authorization token handled here
        'Content-Type': 'application/json',
      },
      body: payload,
      failOnStatusCode: false,  // Disable failing tests on non-2xx responses
    }).then((response) => {
      cy.log('Response:', JSON.stringify(response.body));
      return cy.wrap(response);  // Wrap response for Cypress chaining
    });
  };

  // Fetch the token from the task, which reads from the token.json file
  return cy.task('readToken').then((tokenData) => {
    let authToken = null;

    if (tokenData) {
      const token = JSON.parse(tokenData);
      authToken = token.authorizationHeader;
    }

    return makeRequest(authToken).then((response) => {
      if (response.status === 401) {
        // Token is expired or invalid, refresh the token
        return cy.getAuthorizationToken(true).then((newAuthHeader) => {
          cy.task('writeToken', newAuthHeader);  // Save the new token
          return makeRequest(newAuthHeader);  // Retry the request with new token
        });
      }
      return cy.wrap(response);  // Return response if successful
    });
  });
};


// export const ApiRequestAndAssert = (url, payload, method) => {
//   return cy.request({
//     method: method,
//     url: url,
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: payload,
//     failOnStatusCode: false, // Allow the test to continue even if the status is not 2xx or 3xx
//   }).then((response) => {
//     cy.log('Response:', JSON.stringify(response.body)); // Log the entire response body
//     return cy.wrap(response); // Wrap the response in a Cypress command for further chaining
//   });
// };
