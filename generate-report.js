const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Paths to different directories
const versionFilePath = path.join(__dirname, 'version.json');
const reportDir = path.join(__dirname, 'cypress', 'reports'); // For individual test files
const versionedDir = path.join(__dirname, 'cypress', 'reports', 'versioned'); // For versioned reports
const deploymentDir = path.join(__dirname, 'cypress', 'reports', 'deployment'); // For test-report.html

// Create the deployment directory if it doesn't exist
if (!fs.existsSync(deploymentDir)) {
  fs.mkdirSync(deploymentDir, { recursive: true });
  console.log(`Created deployment directory at ${deploymentDir}`);
}

// Read and increment version
let versionData = JSON.parse(fs.readFileSync(versionFilePath, 'utf8'));
let currentVersion = versionData.version.split('.');

// Increment the version (minor increment)
currentVersion[1] = parseInt(currentVersion[1]) + 1;
const newVersion = currentVersion.join('.');

// Save the incremented version back to version.json
versionData.version = newVersion;
fs.writeFileSync(versionFilePath, JSON.stringify(versionData, null, 2));

// Generate the merged report
const mergedFilePath = path.join(__dirname, `merged-${newVersion}.json`);

exec(`npx mochawesome-merge ${reportDir}/*.json -o ${mergedFilePath} && npx mochawesome-report-generator ${mergedFilePath} --reportDir ${versionedDir} --overwrite --reportFilename report-${newVersion}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error generating report: ${error}`);
    return;
  }
  console.log(`Reports merged and saved as report-${newVersion}.html`);

  // Check if the report file exists in versioned directory
  const newReportPath = path.join(versionedDir, `report-${newVersion}.html`);

  if (fs.existsSync(newReportPath)) {
    console.log(`Report ${newReportPath} found, proceeding to copy to deployment directory`);

    const finalReportPath = path.join(deploymentDir, 'test-report.html');
    fs.copyFileSync(newReportPath, finalReportPath);
    console.log(`Final report saved as test-report.html in the deployment directory`);
  } else {
    console.error(`Report file ${newReportPath} does not exist. Unable to copy to deployment directory.`);
  }

  // Delete the merged JSON file
  fs.unlink(mergedFilePath, (err) => {
    if (err) {
      console.error(`Error deleting file: ${err}`);
    } else {
      console.log(`Merged JSON file (${mergedFilePath}) has been deleted.`);
    }
  });

  // Delete individual test report files in the reportDir
  fs.readdir(reportDir, (err, files) => {
    if (err) {
      console.error(`Error reading report directory: ${err}`);
      return;
    }

    files.forEach(file => {
      // Delete only individual test files (HTML & JSON), excluding versioned and final reports
      if ((file.endsWith('.json') || file.endsWith('.html')) && !file.includes(`report-${newVersion}`)) {
        const filePath = path.join(reportDir, file);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Error deleting file ${file}: ${err}`);
          } else {
            console.log(`Deleted individual test report file: ${file}`);
          }
        });
      }
    });
  });
});
