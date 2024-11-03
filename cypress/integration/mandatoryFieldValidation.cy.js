// cypress/integration/fieldValidation.cy.js
import { ApiRequestAndAssert } from '../support/apiUtils';
import { Error_FieldValidation } from '../model/base-response';

// Utility function to safely traverse and modify nested objects by field path
const setFieldToNull = (object, fieldPath) => {
  const fieldParts = fieldPath.split('.');
  const lastField = fieldParts.pop();
  const nestedObject = fieldParts.reduce((obj, part) => {
    if (!obj[part]) throw new Error(`Field path not found: ${fieldPath}`);
    return obj[part];
  }, object);

  if (nestedObject.hasOwnProperty(lastField)) {
    nestedObject[lastField] = null;
  } else {
    throw new Error(`Field not found: ${lastField}`);
  }
};

// Generates the expected error message based on the field
const getExpectedErrorMessage = (fieldName) => ({
  [fieldName]: `'${fieldName}' must not be empty.`,
});

// Function to validate required fields in a request model
const validateFields = (url, baseRequest, requiredFields) => {
  context('Field Validation', () => {
    requiredFields.forEach(({ field }) => {
      const fieldName = field.split('.').pop();

      it(`Test Case: ${fieldName} should be mandatory`, function () {
        const requestPayload = baseRequest();
        cy.log("Original Request Payload:", JSON.stringify(requestPayload, null, 2));

        try {
          setFieldToNull(requestPayload, field);
        } catch (error) {
          cy.log(error.message);
          return;
        }

        cy.log("Updated Request Payload:", JSON.stringify(requestPayload, null, 2));

        const expectedResponse = Error_FieldValidation(getExpectedErrorMessage(fieldName));

        ApiRequestAndAssert(url, requestPayload, 'POST').then((response) => {
          expect(response.body.responseCode).to.eq(expectedResponse.responseCode);
          expect(response.body.responseMessage).to.eq(expectedResponse.responseMessage);

          if (response.body.data) {
            expect(response.body.data).to.have.property(field);
            const actualErrorMessage = response.body.data[field];
            expect(actualErrorMessage[0]).to.include("must not be empty");
          }
        });
      });
    });
  });
};

// Define required fields for request models as a constant
const REQUIRED_FIELDS = {
  Req_UserVerify: [
    { field: 'data.step' },
    { field: 'data.mobileNumber' },
    { field: 'data.operatorId' },
    // { field: 'systemDefault.deviceId' },
    // { field: 'systemDefault.deviceName' },
    // { field: 'systemDefault.fingerprintData.osVersion' },
    // { field: 'systemDefault.fingerprintData.appVersion' },
    // { field: 'systemDefault.fingerprintData.manufacturer' },
    // { field: 'systemDefault.fingerprintData.model' },
    // { field: 'systemDefault.networkInfo.networkOperator' },
    // { field: 'systemDefault.networkInfo.ipAddress' },
    // { field: 'systemDefault.networkInfo.wifiSsid' },
    // { field: 'systemDefault.location.latitude' },
    // { field: 'systemDefault.location.longitude' },
    // { field: 'systemDefault.client_id' },
  ],
  Req_ValidateOtp: [
    { field: 'data.step' },
    { field: 'data.referenceId' },
    { field: 'data.otp' },
    { field: 'data.service' },
    { field: 'systemDefault.deviceId' },
    { field: 'systemDefault.deviceName' },
    { field: 'systemDefault.fingerprintData.osVersion' },
    { field: 'systemDefault.fingerprintData.appVersion' },
    { field: 'systemDefault.fingerprintData.manufacturer' },
    { field: 'systemDefault.fingerprintData.model' },
    { field: 'systemDefault.networkInfo.networkOperator' },
    { field: 'systemDefault.networkInfo.ipAddress' },
    { field: 'systemDefault.networkInfo.wifiSsid' },
    { field: 'systemDefault.location.latitude' },
    { field: 'systemDefault.location.longitude' },
    { field: 'systemDefault.client_id' },
  ],
  Req_UserRegistration: [
    { field: 'data.step' },
    { field: 'data.referenceId' },
    { field: 'data.pin' },
    { field: 'data.service' },
    { field: 'systemDefault.deviceId' },
    { field: 'systemDefault.deviceName' },
    { field: 'systemDefault.fingerprintData.osVersion' },
    { field: 'systemDefault.fingerprintData.appVersion' },
    { field: 'systemDefault.fingerprintData.manufacturer' },
    { field: 'systemDefault.fingerprintData.model' },
    { field: 'systemDefault.networkInfo.networkOperator' },
    { field: 'systemDefault.networkInfo.ipAddress' },
    { field: 'systemDefault.networkInfo.wifiSsid' },
    { field: 'systemDefault.location.latitude' },
    { field: 'systemDefault.location.longitude' },
    { field: 'systemDefault.client_id' },
  ],
};

// Wrapper functions for each request model to reuse the validateFields function
export const userVerifyFieldValidate = (url, baseRequest) => {
  validateFields(url, baseRequest, REQUIRED_FIELDS.Req_UserVerify);
};

export const validateOtpFieldValidate = (url, baseRequest) => {
  validateFields(url, baseRequest, REQUIRED_FIELDS.Req_ValidateOtp);
};

export const userRegistrationFieldValidate = (url, baseRequest) => {
  validateFields(url, baseRequest, REQUIRED_FIELDS.Req_UserRegistration);
};
