// cypress/model/base-request.js

// App Request Payload (common payload for reuse)

import testData from '../fixtures/test-data.json';

// App Request Payload (common payload for reuse)
export const commonPayload = {
  systemDefault: {
    deviceId: "",  // To be set dynamically
    deviceName: "unique_device_identifier",
    fingerprintData: {
      osVersion: "string",
      appVersion: "string",
      manufacturer: "string",
      model: "string",
    },
    networkInfo: {
      networkOperator: "string",
      mobileNumber: "",  // To be set dynamically
      ipAddress: "string",
      wifiSsid: "string"
    },
    location: {
      latitude: "float",
      longitude: "float"
    },
    client_id: "unique_application_identifier"
  }
};

// export const Req_UserVerify = (mobileNumber = '01964575962', deviceId = 'deviceId') => {
//   return {
//     data: {
//       step: "user-verify",  // Indicates the step for user verification
//       mobileNumber: mobileNumber,  // Set dynamically from test data
//       operatorId: "03"  // Static operator ID
//     },
//     systemDefault: {
//       deviceId: deviceId,  // Set dynamically from test data
//       deviceName: commonPayload.systemDefault.deviceName,
//       client_id: commonPayload.systemDefault.client_id,
//       fingerprintData: { ...commonPayload.systemDefault.fingerprintData },
//       networkInfo: { 
//         ...commonPayload.systemDefault.networkInfo,
//         mobileNumber: mobileNumber // Set dynamically from test data
//       },
//       location: { ...commonPayload.systemDefault.location }
//     }
//   };
// };
export const Req_UserVerify = (mobileNumber = '01964575962', deviceId = 'defaultDeviceId') => {
  return {
    data: {
      step: "user-verify",  
      mobileNumber: mobileNumber,  
      operatorId: "03"  
    },
    systemDefault: {
      deviceId: deviceId,  
      deviceName: commonPayload.systemDefault.deviceName,
      client_id: commonPayload.systemDefault.client_id,
      fingerprintData: { ...commonPayload.systemDefault.fingerprintData },
      networkInfo: { 
        ...commonPayload.systemDefault.networkInfo,
        mobileNumber: mobileNumber 
      },
      location: { ...commonPayload.systemDefault.location }
    }
  };
};

export const Req_ValidateOtp = (referenceId = 'referenceId', deviceId = 'defaultDeviceId', otp = 'defaultOtp') => {
  return {
    data: {
      step: "validate-otp",  // Indicates the step for OTP validation
      referenceId: referenceId,  // Passed dynamically
      otp: otp  // Passed dynamically
    },
    systemDefault: {
      deviceId: deviceId,  // Set dynamically from test data
      deviceName: commonPayload.systemDefault.deviceName,
      client_id: commonPayload.systemDefault.client_id,
      fingerprintData: { ...commonPayload.systemDefault.fingerprintData },
      networkInfo: { ...commonPayload.systemDefault.networkInfo },
      location: { ...commonPayload.systemDefault.location }
    }
  };
};

export const Req_UserRegistration = {
  data: {
    step: "user-registration",  // Indicates the step for user-registration
    referenceId: "referenceId", 
    pin: "03"  // Sample operator ID
  },
  systemDefault: {
    deviceId: commonPayload.systemDefault.deviceId,
    deviceName: commonPayload.systemDefault.deviceName,
    client_id: commonPayload.systemDefault.client_id,
    fingerprintData: { ...commonPayload.systemDefault.fingerprintData },
    networkInfo: { ...commonPayload.systemDefault.networkInfo },
    location: { ...commonPayload.systemDefault.location }
  }
};
