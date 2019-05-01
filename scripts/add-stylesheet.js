const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');
const { BUILD_PATH, STYLES_PATH } = require('./constants');

module.exports = stylesheet => {
  stylesheetsAdded.add(stylesheet);

  fs.writeFileSync(
    path.join(BUILD_PATH, stylesheet),
    new CleanCSS({ level: 2 }).minify(fs.readFileSync(path.join(STYLES_PATH, stylesheet))).styles,
  );
};
