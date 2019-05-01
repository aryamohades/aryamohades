const CleanCSS = require('clean-css');

module.exports = css => new CleanCSS({ level: 2 }).minify(css).styles;
