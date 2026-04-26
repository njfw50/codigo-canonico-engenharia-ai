const fs = require('fs');
const path = require('path');

/**
 * Exposes the Canonical Laws programmatically for internal systemic use.
 */

function getLaw(lawNumber) {
  const lawsDir = path.join(__dirname, 'laws');
  const files = fs.readdirSync(lawsDir);
  
  // Find the file that matches lawXX (e.g., law01, law10)
  const paddedNumber = String(lawNumber).padStart(2, '0');
  const targetFile = files.find(f => f.startsWith(`law${paddedNumber}_`));
  
  if (!targetFile) {
    throw new Error(`[Canonical Protocol] Law ${paddedNumber} not found.`);
  }

  return fs.readFileSync(path.join(lawsDir, targetFile), 'utf8');
}

module.exports = {
  getLaw,
  version: "1.0.0",
  doctrine: "Structured Technocracy"
};
