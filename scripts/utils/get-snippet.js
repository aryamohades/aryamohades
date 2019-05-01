const fs = require('fs');
const path = require('path');
const { SNIPPETS_PATH } = require('../constants');

module.exports = snippet => fs.readFileSync(path.join(SNIPPETS_PATH, snippet));
