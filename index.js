// Copyright 2026 Michel Silva de Souza
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
