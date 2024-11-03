
// cypress/support/responseUtils.js
export const validateBaseResponse = (responseData, expectedResponse) => {
  expect(responseData.responseCode, 'Verified response code').to.eq(expectedResponse.responseCode);
  expect(responseData.activityCode, 'Verified activity code').to.eq(expectedResponse.activityCode);
  expect(responseData.responseMessage, 'Verified response message').to.eq(expectedResponse.responseMessage);
};

export const validateResponseData = (responseData, expectedDataModel) => {
  validateSpecificFields(responseData.data, expectedDataModel);
};


// export const validateSpecificFields = (responseData, model) => {
//   // Recursive function to check fields dynamically
//   const checkFields = (model, data) => {
//     Object.keys(model).forEach((key) => {
//       expect(data).to.have.property(key);
      
//       // If the field is an object, recurse into it
//       if (typeof model[key] === 'object' && model[key] !== null) {
//         checkFields(model[key], data[key]);
//       }
//     });
//   };

//   // Start validation using the provided model
//   checkFields(model, responseData);
// };
