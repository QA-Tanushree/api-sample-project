// Import necessary modules and functions
import { ApiRequestAndAssert } from '../support/apiUtils';  
import { validateBaseResponse } from '../support/responsUtlis';
import { URL_UserVerify } from '../model/end-point';
import { Req_UserVerify } from '../model/base-request';
import { Success, Error_BusinessError } from '../model/base-response';
import testData from '../fixtures/test-data.json';
import { userVerifyBusinessValidation } from '../integration/businessValidation.cy';
import { userVerifyFieldValidate } from '../integration/mandatoryFieldValidation.cy';

// Helper functions to generate dynamic data
const generateRandomMobileNumber = () => '019' + Math.floor(Math.random() * 90000000);
const generateRandomDeviceId = () => 'Dev' + Math.floor(Math.random() * 10000);

// Destructure common test data
const { mobileNumber, deviceId, lockUser, invalidRole, lockDevice } = testData.test;

// Constants for operatorId and attempt counts
const ATTEMPT_LIMIT = 3;

// Function to get the expected outcome based on activity content
const getExpectedOutcome = (activityContent, expectedOutcome) => {
  const outcomeMapping = {
    existingUserSuccess: activityContent.userExist,
    newUserSuccess: activityContent.userNotExist,
    userLocked: activityContent.userLocked,
    invalidRole: activityContent.invalidRole,
    locked: activityContent.deviceLocked,
  };

  const outcome = outcomeMapping[expectedOutcome];

  if (!outcome) {
    cy.log(`Error: Outcome mapping not found for '${expectedOutcome}'`);
    return { responseMessage: 'Outcome not mapped', activityCode: '0000' }; // Fallback response
  }

  return outcome;
};

// Function to run user verification tests
const runUserVerifyTest = (mobileNumber, expectedOutcome, deviceId = testData.deviceId, attemptCount = 1) => {
  const requestPayload = Req_UserVerify(mobileNumber, deviceId);

  cy.fixture('activity-content').then((activityContent) => {
    const { responseMessage, activityCode } = getExpectedOutcome(activityContent, expectedOutcome);

    const expectedResponse = expectedOutcome.includes('Success')
      ? Success(activityCode, responseMessage)
      : Error_BusinessError(activityCode, responseMessage);

    ApiRequestAndAssert(URL_UserVerify, requestPayload, 'POST').then((response) => {
      cy.log('Request Payload:', JSON.stringify(requestPayload, null, 2));
      cy.log('Response:', JSON.stringify(response.body, null, 2));
      validateBaseResponse(response.body, expectedResponse);

      if (expectedOutcome.includes('Success') && response.body.data?.referenceId) {
        // Prevent multiple writes to the file
        cy.readFile('cypress/fixtures/test-data.json').then((existingData) => {
          if (existingData.referenceId !== response.body.data.referenceId) {
            existingData.referenceId = response.body.data.referenceId;
            cy.writeFile('cypress/fixtures/test-data.json', existingData);
          }
        });
      }
    });
  });
};


describe('API Test - User Verify', () => {
  before(() => {
    // Get Authorization Token once
    cy.getAuthorizationToken().then((authHeader) => {
      Cypress.env('authorizationHeader', authHeader);
    });
  });

  // Call the userVerifyBusinessValidation
  userVerifyFieldValidate(URL_UserVerify, Req_UserVerify);
  userVerifyBusinessValidation(URL_UserVerify, Req_UserVerify(mobileNumber, deviceId));

  
  context('Success Cases', () => {
    it('Testcase: Unregistered User should return isUserExist:false', () => {
      runUserVerifyTest(generateRandomMobileNumber(), 'newUserSuccess');
    });

    it('Testcase: Registered User should return isUserExist:true', () => {
      runUserVerifyTest(mobileNumber, 'existingUserSuccess');
    });
  });

  context('Business Logic Validation', () => {
    it('Testcase: Device should lock after 3 failed attempts', () => {
      const deviceId = generateRandomDeviceId();  // Use the same deviceId for all attempts

      for (let i = 1; i <= ATTEMPT_LIMIT; i++) {
        runUserVerifyTest(generateRandomMobileNumber(), 'newUserSuccess', deviceId, i);  // Use the same deviceId
      }

      // After 3 attempts, the device should be locked
      runUserVerifyTest(generateRandomMobileNumber(), 'locked', deviceId, ATTEMPT_LIMIT + 1);  // Check if the device is locked
    });

    it('Testcase: Locked device should block further actions', () => {
      runUserVerifyTest(mobileNumber, 'locked', lockDevice);
    });

    it('Testcase: Locked user should be prevented from further actions', () => {
      runUserVerifyTest(lockUser, 'locked', deviceId);
    });

    it('Testcase: Invalid user role should not succeed', () => {
      runUserVerifyTest(invalidRole, 'invalidRole', deviceId);
    });
  });
});
