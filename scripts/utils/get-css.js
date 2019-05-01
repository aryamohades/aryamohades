const fs = require('fs');
const path = require('path');
const { STYLES_PATH } = require('../constants');

module.exports = stylesheet => fs.readFileSync(path.join(STYLES_PATH, stylesheet));
