const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const posts = require('./get-posts');
const { BUILD_PATH, SITE_CONFIG, BASE_HTML, SNIPPETS_PATH } = require('./constants');
const minifyHtml = require('./minify-html');
const addScript = require('./add-script');
const addStylesheet = require('./add-stylesheet');
const buildMeta = require('./build-meta');
const buildStyle = require('./build-style');
const buildHeader = require('./build-header');
const buildFooter = require('./build-footer');

const postRenderMap = {
  header: (data, $) => $(`<h3>${data.value}</h3>`),
  paragraph: (data, $) => $(`<p>${data.value}</p>`),
  code: (data, $) =>
    $(
      `<pre><code class="language-${data.syntax}">${fs.readFileSync(
        path.join(SNIPPETS_PATH, data.snippet),
      )}</code></pre>`,
    ),
};

const stylesheetsAdded = new Set();

module.exports = () => {
  posts.forEach(post => {
    const $ = cheerio.load(BASE_HTML);
    const bodyElem = $('.body');
    const headElem = $('head');

    headElem.append(`<title>${post.title} - ${SITE_CONFIG.name}</title>`);

    buildMeta(post.meta, $);
    buildHeader($);
    buildFooter($);
    buildStyle('post.css', $);

    const detailElem = $('<div class="post-detail"></div>');
    const contentElem = $('<div class="post-content"></div>');

    detailElem.append('<a href="/" class="back">Back</a>');
    detailElem.append(`<div class="post-title">${post.title}</div>`);
    detailElem.append(`<div class="date">${post.date}</div>`);

    post.content.forEach(element => {
      contentElem.append(postRenderMap[element.type](element, $));
    });

    detailElem.append(contentElem);
    bodyElem.append(detailElem);

    if (post.stylesheets) {
      post.stylesheets.forEach(stylesheet => {
        headElem.append(
          `<link rel="stylesheet" href="/${stylesheet}" type="text/css" media="all">`,
        );

        addStylesheet(stylesheet);
      });

      post.js.forEach(script => {
        headElem.append(`<script async defer src="/${script}"></script>`);
        addScript(script);
      });
    }

    fs.writeFileSync(path.join(BUILD_PATH, post.file), minifyHtml($));
  });
};