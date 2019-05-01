const fs = require('fs');
const path = require('path');
const { BUILD_PATH } = require('../constants');
const getCSS = require('./get-css');
const minifyCSS = require('./minify-css');

module.exports = stylesheet => {
  const css = minifyCSS(getCSS(stylesheet));
  fs.writeFileSync(path.join(BUILD_PATH, stylesheet), css);
};
