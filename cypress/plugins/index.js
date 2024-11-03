// const fs = require('fs');
// const path = require('path');

// module.exports = (on, config) => {
//   // Task for reading and writing tokens
//   on('task', {
//     readToken() {
//       const tokenFilePath = path.join(__dirname, '../fixtures/value/token.json');
//       if (fs.existsSync(tokenFilePath)) {
//         const tokenData = JSON.parse(fs.readFileSync(tokenFilePath));
//         return tokenData.authorizationHeader; // Return the stored token
//       }
//       return null; // Return null if the file does not exist
//     },
//     writeToken(token) {
//       const tokenFilePath = path.join(__dirname, '../fixtures/value/token.json');
//       fs.writeFileSync(tokenFilePath, JSON.stringify({ authorizationHeader: token }, null, 2));
//       return null; // Indicate that the task is done
//     }
//   });

//   // Configure Mochawesome
//   require('cypress-mochawesome-reporter/plugin')(on);

//   // Return the config object if necessary
//   return config;
// };
const fs = require('fs');
const path = require('path');

module.exports = (on, config) => {
  on('task', {
    readToken() {
      const tokenFilePath = path.join(__dirname, '../fixtures/value/token.json');
      if (fs.existsSync(tokenFilePath)) {
        const tokenData = JSON.parse(fs.readFileSync(tokenFilePath));
        return tokenData.authorizationHeader; // Return the stored token
      }
      return null; // Return null if the file does not exist
    },
    writeToken(token) {
      const tokenFilePath = path.join(__dirname, '../fixtures/value/token.json');
      fs.writeFileSync(tokenFilePath, JSON.stringify({ authorizationHeader: token }, null, 2));
      return null; // Indicate that the task is done
    }
  });
  //Configure Mochawesome
  require('cypress-mochawesome-reporter/plugin')(on);

  // Return the config object if necessary
  return config;
};

