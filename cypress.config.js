const fs = require('fs');
const path = require('path');

const environment = process.env.ENV || 'test'; // Default to 'test' if ENV is not provided

const baseUrls = {
  test: 'https://e1fae3ea-4bff-4012-be5d-2a7bb7c067ab.mock.pstmn.io/api-v1',
  live: 'https://live.api.yourdomain.com',
};

// Path to the token.json file
const tokenFilePath = path.join(__dirname, 'cypress', 'fixtures', 'value', 'token.json');

// Path to the test data file
const testDataFilePath = path.join(__dirname, 'cypress', 'fixtures', 'test-data.json');

let mobileNumber = 'default_mobile_number';  // Default value
let deviceId = 'default_device_id';  // Default value

// Read the test data file and set mobileNumber and deviceId dynamically
if (fs.existsSync(testDataFilePath)) {
  const testData = JSON.parse(fs.readFileSync(testDataFilePath, 'utf8'));
  mobileNumber = testData.mobileNumber || mobileNumber;  // Update if exists
  deviceId = testData.deviceId || deviceId;  // Update if exists
}

module.exports = {
  e2e: {
    baseUrl: baseUrls[environment],
    env: {
      mobileNumber,  // Set dynamic mobile number
      deviceId,  // Set dynamic device ID
    },
    setupNodeEvents(on, config) {
      on('task', {
        // Task to read the token from token.json
        readToken() {
          if (fs.existsSync(tokenFilePath)) {
            return fs.readFileSync(tokenFilePath, 'utf8'); // Return token if file exists
          }
          return null;
        },

        // Task to write the token to token.json
        writeToken(token) {
          fs.writeFileSync(tokenFilePath, JSON.stringify({ authorizationHeader: token }, null, 2));
          return null;
        },
      });

      return config; // Return the modified configuration
    },
  },

  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: false,
    html: true,
    json: true,
  },
};
