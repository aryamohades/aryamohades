const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const { posts } = require('./utils');
const { BUILD_PATH, SITE_CONFIG, BASE_HTML } = require('./constants');
const { getSnippet, addStylesheet, addScript, addStyle, minifyHTML } = require('./utils');
const { buildHeader, buildFooter, buildMeta } = require('./common');

// code data.syntax values: javascript | rust | python | docker | ...
const renderElement = {
  header: (data, $) => $(`<h3>${data.value}</h3>`),
  paragraph: (data, $) => $(`<p>${data.value}</p>`),
  code: (data, $) =>
    $(`<pre><code class="language-${data.syntax}">${getSnippet(data.snippet)}</code></pre>`),
};

module.exports = () => {
  posts.forEach(post => {
    const $ = cheerio.load(BASE_HTML);
    const bodyElem = $('.body');
    const headElem = $('head');

    headElem.append(`<title>${post.title} - ${SITE_CONFIG.name}</title>`);

    buildMeta(post.meta, $);
    buildHeader($);
    buildFooter($);
    addStyle($);

    const detailElem = $('<div class="post-detail"></div>');
    const contentElem = $('<div class="post-content"></div>');

    detailElem.append('<a href="/" class="back">Back</a>');
    detailElem.append(`<div class="post-title">${post.title}</div>`);
    detailElem.append(`<div class="date">${post.date}</div>`);

    post.content.forEach(element => {
      contentElem.append(renderElement[element.type](element, $));
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
    }

    if (post.scripts) {
      post.scripts.forEach(script => {
        headElem.append(`<script async defer src="/${script}"></script>`);
        addScript(script);
      });
    }

    fs.writeFileSync(path.join(BUILD_PATH, post.file), minifyHTML($));
  });
};
