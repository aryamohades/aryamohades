/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const mkdirp = require('mkdirp');
const { copyImages, minifyHTML, addStyle, addStylesheet } = require('./utils');
const { buildHeader, buildFooter, buildMeta } = require('./common');
const { home, about, projects } = require('./pages');
const compilePosts = require('./compile-posts');
const { BUILD_PATH, SITE_CONFIG, BASE_HTML } = require('./constants');

const renderPage = {
  index: home,
  about: about,
  projects: projects,
};

function buildHeadersFile() {
  let headers = fs.readdirSync(BUILD_PATH).reduce((acc, file) => {
    let contentType = 'text/html';

    if (file.endsWith('.css')) {
      contentType = 'text/css';
    } else if (file.endsWith('.js')) {
      contentType = 'text/javascript';
    }

    acc += `/${file}\n`;
    acc += `\tContent-Type: ${contentType}\n\n`;

    return acc;
  }, '');

  headers = `/\n\tContent-Type: text/html\n\n` + headers;

  fs.writeFileSync(path.join(BUILD_PATH, '_headers'), headers);
}

function buildPages() {
  SITE_CONFIG.pages.forEach(page => {
    buildPage(page);
  });
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
  addStyle($);
  renderPage[page.name](page.data, $);
  fs.writeFileSync(path.join(BUILD_PATH, options.file), minifyHTML($));
}

function cleanBuildDirectory() {
  fs.readdirSync(BUILD_PATH).forEach(file => {
    fs.unlinkSync(path.join(BUILD_PATH, file));
  });
}

function build() {
  mkdirp(BUILD_PATH, err => {
    if (err) {
      console.error(err);
    } else {
      cleanBuildDirectory();
      addStylesheet('base.css');
      compilePosts();
      buildPages();
      copyImages();
      buildHeadersFile();
    }
  });
}

build();
