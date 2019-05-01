const { getCSS, minifyCSS } = require('../utils');
const { BASE_STYLE } = require('../constants');

module.exports = (style, $) => {
  const css = style ? minifyCSS(`${BASE_STYLE}${getCSS(style)}`) : minifyCSS(BASE_STYLE);
  $('head').append(`<style>${css}</style>`);
};
