const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');
const { STYLES_PATH, BASE_STYLE } = require('./constants');

module.exports = (style, $) => {
  const pageStyle = style
    ? new CleanCSS({ level: 2 }).minify(fs.readFileSync(path.join(STYLES_PATH, style))).styles
    : '';

  $('head').append(`<style>${BASE_STYLE}${pageStyle}</style>`);
}