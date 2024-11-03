// Import necessary modules and functions
import { ApiRequestAndAssert } from '../support/apiUtils';  
import { validateBaseResponse } from '../support/responsUtlis';
import { URL_UserVerify } from '../model/end-point';
import { Req_UserVerify } from '../model/base-request';
import { Success, Error_BusinessError } from '../model/base-response';
import testData from '../fixtures/test-data.json';
import { userVerifyBusinessValidation } from '../integration/businessValidation.cy';
import { userVerifyFieldValidate } from '../integration/mandatoryFieldValidation.cy';

// Assuming mobileNumber and deviceId are retrieved from testData
const mobileNumber = testData.mobileNumber; // Ensure this is a valid mobile number
const deviceId = testData.deviceId; // Ensure this is a valid device ID
const requestPayload = Req_UserVerify(mobileNumber, deviceId);

// Call the userVerifyBusinessValidation function with the correct parameters
userVerifyBusinessValidation(URL_UserVerify, requestPayload);
userVerifyFieldValidate(URL_UserVerify, requestPayload);

