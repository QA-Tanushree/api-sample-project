import { ApiRequestAndAssert } from '../support/apiUtils'; 
import { validateBaseResponse } from '../support/responsUtlis';
import { URL_ValidateOtp } from '../model/end-point';
import { Req_ValidateOtp } from '../model/base-request';
import { Success, Error_BusinessError } from '../model/base-response';
import { validateOtpBusinessValidation } from '../integration/businessValidation.cy';
import { validateOtpFieldValidate } from '../integration/mandatoryFieldValidation.cy';

let deviceId; // Declare variable to hold device ID
let referenceId;
let otp;

describe('API Test - OTP Validation', () => {
  before(() => {
    // Load the token only once before all tests
    cy.fixture('value/token').then((tokenData) => {
      Cypress.env('authorizationHeader', tokenData.authorizationHeader);
    });
  });

  beforeEach(() => {
    // Load activity content and other required test data
    cy.fixture('activity-content').as('activityContent');
    cy.fixture('test-data.json').then((testData) => {
      deviceId = testData.test.deviceId; // Load deviceId from test-data.json
      referenceId = testData.test.referenceId; // Load referenceId from test-data.json
      otp = testData.test.otp; // Load OTP from test-data.json
    });
  });

  // Utility function to validate the API response
  const validateResponse = (response, expectedResponse) => {
    validateBaseResponse(response.body, expectedResponse); // Perform base response validation
  };

  const runOtpTest = (referenceId, expectedOutcome, attemptCount = 1, deviceId = deviceId) => {
    // Prepare the request payload
    const requestPayload = Req_ValidateOtp({
      referenceId: referenceId,
      deviceId: deviceId,
      otp: otp,
    });

    cy.get('@activityContent').then((activityContent) => {
      let responseMessage, activityCode;

      switch (expectedOutcome) {
        case 'fail':
          ({ responseMessage, activityCode } = activityContent.otpFail);
          break;
        case 'negSuccess':
          ({ responseMessage, activityCode } = activityContent.otpFail);
          break;
        case 'expired':
          ({ responseMessage, activityCode } = activityContent.otpExpired);
          break;
        case 'OtpMaxAttemptsExceeded':
          ({ responseMessage, activityCode } = activityContent.OtpMaxAttemptsExceeded);
          break;
        default:
          ({ responseMessage, activityCode } = activityContent.otpSuccess);
      }

      const expectedResponse = expectedOutcome === 'success'
        ? Success(activityCode, responseMessage)
        : Error_BusinessError(activityCode, responseMessage);

      // Make the API request and validate response
      ApiRequestAndAssert(URL_ValidateOtp, requestPayload, 'POST').then((response) => {
        cy.log('Request Payload:', JSON.stringify(requestPayload, null, 2));
        cy.log('Response:', JSON.stringify(response.body, null, 2));
        validateResponse(response, expectedResponse); // Reuse validation logic
      });
    });
  };

  // // Mandatory field validation and business validation
  // validateOtpFieldValidate(URL_ValidateOtp, Req_ValidateOtp);
  validateOtpBusinessValidation(URL_ValidateOtp, Req_ValidateOtp);

  context('Success', () => {
    it('TestCase: User registration should succeed with valid OTP', () => {
      runOtpTest(referenceId, 'success', 1, deviceId, otp); // Unregistered user test
    });
  });

  context('Business logic validation', () => {
    it('TestCase: Should return error for first, second, and third attempts', () => {
      for (let i = 1; i <= 3; i++) {
        runOtpTest(referenceId, 'negSuccess', i, deviceId, otp); // Fail 3 times
      }
      runOtpTest(referenceId, 'locked', 4, deviceId, otp); // Lock the device on 4th attempt
    });

    it('TestCase: Should return error when OTP has expired', () => {
      runOtpTest(referenceId, 'expired', 1, deviceId, otp); // Test with expired OTP
    });
  });
});
