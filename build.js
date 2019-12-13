const cheerio = require('cheerio');
const minify = require('html-minifier').minify;
const CleanCSS = require('clean-css');
const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, 'build');
const pagesDir = path.join(__dirname, 'pages');
const baseHtml = fs.readFileSync(path.join(__dirname, 'base.html'));

function readFile(name) {
  return fs.readFileSync(path.join(pagesDir, `${name}.html`));
}

function getPages() {
  return fs.readdirSync(pagesDir).map(name => name.split('.')[0]);
}

function buildPages(pages) {
  pages.forEach(name => buildPage(name));
}

function buildPage(name) {
  const $ = cheerio.load(baseHtml);
  const html = readFile(name);

  $('.site-content').html(html);

  fs.writeFileSync(
    path.join(buildDir, name),
    minify($.html(), {
      collapseBooleanAttributes: true,
      collapseInlineTagWhitespace: true,
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true,
      minifyURLs: true,
      removeAttributeQuotes: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeEmptyElements: true,
      removeOptionalTags: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      sortAttributes: true,
      sortClassName: true,
      useShortDoctype: true
    })
  );
}

function buildCSS() {
  const css = fs.readFileSync(path.join(__dirname, 'base.css'));

  const output = new CleanCSS({
    level: 2
  }).minify(css);

  fs.writeFileSync(path.join(buildDir, 'base.css'), output.styles);
}

function addHeaders() {
  fs.copyFileSync(
    path.join(__dirname, '_headers'),
    path.join(buildDir, '_headers')
  );
}

console.log('building');

// Build CSS
buildCSS();

// Build pages
buildPages(getPages());

// Add headers file
addHeaders();

console.log('done');
