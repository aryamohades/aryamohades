const fs = require('fs');
const path = require('path');
const { BUILD_PATH } = require('../constants');
const getJS = require('./get-js');
const minifyJS = require('./minify-js');

module.exports = script => {
  const js = minifyJS(getJS(script));
  fs.writeFileSync(path.join(BUILD_PATH, script), js);
};
