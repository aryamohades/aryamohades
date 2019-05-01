const minifyHtml = require('html-minifier').minify;

module.exports = $ =>
  minifyHtml($.html(), {
    minifyCSS: true,
    minifyJS: true,
    collapseBooleanAttributes: true,
    minifyURLs: true,
    removeAttributeQuotes: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeEmptyElements: true,
    removeOptionalTags: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    removeTagWhitespace: true,
    sortAttributes: true,
    sortClassName: true,
  });
