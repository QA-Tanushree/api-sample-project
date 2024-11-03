// cypress/integration/businessValidation.cy.js
import { ApiRequestAndAssert } from '../support/apiUtils';
import { Error_BusinessError } from '../model/base-response';
import activityContent from '../fixtures/activity-content.json';

// General validation function for mandatory fields
const validateFields = (url, baseRequest, requiredFields) => {
  context('Business Validation', () => {
    if (!baseRequest || Object.keys(baseRequest).length === 0) {
      throw new Error("baseRequest is undefined or empty");
    }

    requiredFields.forEach(({ field }) => {
      const fieldName = field.split('.').pop();

      it(`TestCase: Invalid ${fieldName} should not allow`, function () {
        // Create a copy of the base request
        const requestPayload = JSON.parse(JSON.stringify(baseRequest));
        const fieldParts = field.split('.');
        const lastField = fieldParts.pop();
        let nestedObject = requestPayload;

        // Navigate through the field path
        fieldParts.forEach(part => {
          if (nestedObject[part]) {
            nestedObject = nestedObject[part];
          } else {
            throw new Error(`Field path not found: ${field}`);
          }
        });

        // Set the field to "Invalid" for testing
        if (lastField in nestedObject) {
          nestedObject[lastField] = "Invalid";
        } else {
          throw new Error(`Field not found: ${field}`);
        }

        // Get the error message from the activity content
        const errorMessage = activityContent.businessError[lastField];
        if (!errorMessage) {
          throw new Error(`No error message found for field: ${lastField}`);
        }

        const expectedResponse = Error_BusinessError(errorMessage.activityCode, errorMessage.responseMessage);

        // Log the request payload and assert the response
        cy.log('Request Payload:', JSON.stringify(requestPayload, null, 2));

        ApiRequestAndAssert(url, requestPayload).then((response) => {
          expect(response.body.responseCode).to.eq(expectedResponse.responseCode);
          expect(response.body.responseMessage).to.eq(expectedResponse.responseMessage);
        });
      });
    });
  });
};
// List of request models and their required fields
const requiredFieldsForModels = {
  Req_UserVerify: [
    { field: 'data.step' },
    { field: 'data.mobileNumber' },
    { field: 'data.operatorId' },
  ],
  Req_ValidateOtp: [
    { field: 'data.step' },
    { field: 'data.referenceId' },
    { field: 'data.otp' },
  ],
  Req_UserRegistration: [
    { field: 'data.step' },
    { field: 'data.referenceId' },
    { field: 'data.pin' },
  ]
};

// Export validation functions for different request models
export const userVerifyBusinessValidation = (url, baseRequest) => {
  validateFields(url, baseRequest, requiredFieldsForModels.Req_UserVerify);
};
export const validateOtpBusinessValidation = (url, baseRequest) => {
  validateFields(url, baseRequest, requiredFieldsForModels.Req_ValidateOtp);
};

export const userRegistrationBusinessValidation = (url, baseRequest) => {
  validateFields(url, baseRequest, requiredFieldsForModels.Req_UserRegistration);
};
