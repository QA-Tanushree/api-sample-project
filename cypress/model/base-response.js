//cypress\model\base-response.js
export const Error_FieldValidation = ( data = {}) => {
    return {
        
        data: data,
        responseCode: 400,
        responseMessage: "This field is required(4000)",
    };
};

// export const Error_BusinessError = ( responseMessage) => {
//     return {
//         responseCode: 100,
//         responseMessage: responseMessage,
//         data: null,
//     }
// }
export const Error_BusinessError = (activityCode, responseMessage) => {
    return {
        responseCode: 100,
        activityCode: activityCode,  // Ensure the correct activity code is passed
        responseMessage: responseMessage,
        data: null,
    };
};

export const Success = (activityCode,  responseMessage, data = {}) => {
    return {
        responseCode: 200,
        activityCode: activityCode,  // Ensure activityCode is included here
        responseMessage: responseMessage, // Make sure responseMessage is set here
        data: data
    };
};

// cypress/model/base-response.js
export const  Res_UserVerify = {
    referenceId: '',
    userExist: '',
};