/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const mkdirp = require('mkdirp');
const compilePosts = require('./compile-posts');
const copyImages = require('./copy-images');
const minifyHtml = require('./minify-html');
const buildMeta = require('./build-meta');
const buildStyle = require('./build-style');
const buildHeader = require('./build-header');
const buildFooter = require('./build-footer');
const {
  home,
  about,
  projects,
} = require('./pages');
const {
  CONFIG_PATH,
  BUILD_PATH,
  TEMPLATES_PATH,
  STYLES_PATH,
  SNIPPETS_PATH,
  IMAGES_PATH,
  SITE_CONFIG,
  BASE_HTML,
  BASE_STYLE,
  IGNORE_FILES,
} = require('./constants');

const renderMap = {
  index: home,
  about: about,
  projects: projects,
};

function buildHeadersFile() {
  let headers = fs.readdirSync(BUILD_PATH).reduce((acc, page) => {
    acc += `/${page}\n`;
    acc += `\tContent-Type: text/html\n\n`;

    return acc;
  }, '');

  headers = `/\n\tContent-Type: text/html\n\n` + headers;

  fs.writeFileSync(path.join(BUILD_PATH, '_headers'), headers);
}

function buildPage(page, options) {
  options = Object.assign(
    {
      file: page.name,
    },
    options,
  );

  const $ = cheerio.load(BASE_HTML);

  buildMeta(page.meta, $);
  buildHeader($);
  buildFooter($);
  buildStyle(page.style, $);
  renderMap[page.name](page.data, $);
  fs.writeFileSync(path.join(BUILD_PATH, options.file), minifyHtml($));
}

function cleanBuildDirectory() {
  fs.readdirSync(BUILD_PATH).forEach(file => {
    fs.unlinkSync(path.join(BUILD_PATH, file));
  });
}

function buildPages() {
  SITE_CONFIG.pages.forEach(page => {
    buildPage(page);
  });
}

function build() {
  mkdirp(BUILD_PATH, err => {
    if (err) {
      console.error(err);
    } else {
      cleanBuildDirectory();
      compilePosts();
      buildPages();
      copyImages();
      buildHeadersFile();
    }
  });
}

build();
