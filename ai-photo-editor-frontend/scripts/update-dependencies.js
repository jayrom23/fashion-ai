const fs = require('fs');
const path = require('path');

// Path to package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');

// Read the current package.json
try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  // Dependencies to check and add if missing
  const requiredDependencies = {
    'framer-motion': '^10.16.4',
    'react-hot-toast': '^2.4.1'
  };
  
  let madeChanges = false;

  // Check each dependency
  Object.entries(requiredDependencies).forEach(([pkg, version]) => {
    if (!packageJson.dependencies[pkg]) {
      console.log(`Adding ${pkg} to dependencies...`);
      packageJson.dependencies[pkg] = version;
      madeChanges = true;
    } else {
      console.log(`${pkg} is already in package.json`);
    }
  });

  // Write back the updated package.json if changes were made
  if (madeChanges) {
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('Successfully updated dependencies in package.json');
    console.log('Run "npm install" or "yarn" to install the new dependencies.');
  }
} catch (error) {
  console.error('Failed to update package.json:', error);
}
