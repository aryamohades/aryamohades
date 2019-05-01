const fs = require('fs');
const path = require('path');
const { SCRIPTS_PATH } = require('../constants');

module.exports = script => String(fs.readFileSync(path.join(SCRIPTS_PATH, script)));
