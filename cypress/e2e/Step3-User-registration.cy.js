import { ApiRequestAndAssert } from '../support/apiUtils';
import { validateSpecificFields } from '../support/responsUtlis';
import { URL_UserRegistration } from '../model/end-point';
import { Req_UserRegistration } from '../model/base-request';
import { Error_BusinessError, Success } from '../model/base-response';
import { userRegistrationBusinessValidation } from '../integration/businessValidation.cy';
import { userRegistrationFieldValidate } from '../integration/mandatoryFieldValidation.cy';

describe('API Test - User Verify', () => {
  before(() => {
    // Load the token only once before all tests
    cy.fixture('value/token').then((tokenData) => {
      Cypress.env('authorizationHeader', tokenData.authorizationHeader);
    });
  });

  beforeEach(() => {
    // Load activity content and other required test data
    cy.fixture('activity-content').as('activityContent');
    cy.fixture('test-data.json').then((referenceData) => {
      Cypress.env('referenceId', referenceData.referenceId);
      Cypress.env('pin', referenceData.test.pin);
    });
  });

  // Reusable function to prepare the request payload
  const preparePayload = () => ({
    ...Req_UserRegistration,
    referenceId: Cypress.env('referenceId'),
    pin: Cypress.env('pin'),
  });

// Utility function to validate API responses using the response utils
const validateResponse = (response, expectedResponse) => {
    validateSpecificFields(response.body, expectedResponse); // Validate fields dynamically
  };

//   // Business validation tests for User Registration
//   userRegistrationBusinessValidation(URL_UserRegistration, Req_UserRegistration);
//   userRegistrationFieldValidate(URL_UserRegistration, Req_UserRegistration);

  context('Success', () => {
    it('TestCase: User registration should succeed with valid data', () => {
      const requestPayload = preparePayload(); // Prepare request payload

      cy.get('@activityContent').then((activityContent) => {
        const { activityCode, responseMessage } = activityContent.RegSuccess; // Retrieve expected response data
        const expectedResponse = Success(activityCode, responseMessage); // Prepare expected response

        // Make the API request and validate response
        ApiRequestAndAssert(URL_UserRegistration, requestPayload, 'POST').then((response) => {
          cy.log('Request Payload:', JSON.stringify(requestPayload, null, 2));
          cy.log('Response:', JSON.stringify(response.body, null, 2));
          validateResponse(response, expectedResponse); // Reuse validation logic
        });
      });
    });
  });

  context('Business logic validation', () => {
    it('TestCase: Already registered user should not be allowed', () => {
      const requestPayload = preparePayload(); // Prepare request payload

      cy.get('@activityContent').then((activityContent) => {
        const { activityCode, responseMessage } = activityContent.userExist; // Retrieve expected response data
        const expectedResponse = Error_BusinessError(activityCode, responseMessage); // Prepare expected response

        // Make the API request and validate response
        ApiRequestAndAssert(URL_UserRegistration, requestPayload, 'POST').then((response) => {
          cy.log('Request Payload:', JSON.stringify(requestPayload, null, 2));
          cy.log('Response:', JSON.stringify(response.body, null, 2));
          validateResponse(response, expectedResponse); // Reuse validation logic
        });
      });
    });
  });
});
