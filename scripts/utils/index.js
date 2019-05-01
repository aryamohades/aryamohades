const getJS = require('./get-js');
const getCSS = require('./get-css');
const minifyJS = require('./minify-js');
const minifyHTML = require('./minify-html');
const minifyCSS = require('./minify-css');
const addStylesheet = require('./add-stylesheet');
const addScript = require('./add-script');
const copyImages = require('./copy-images');
const posts = require('./get-posts');

module.exports = {
  getJS,
  getCSS,
  minifyJS,
  minifyHTML,
  minifyCSS,
  addStylesheet,
  addScript,
  copyImages,
  posts,
};
