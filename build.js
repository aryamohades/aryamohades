const cheerio = require('cheerio');
const minify = require('html-minifier').minify;
const CleanCSS = require('clean-css');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'out');
const pagesDir = path.join(__dirname, 'pages');
const snippetsDir = path.join(__dirname, 'snippets');
const baseHtml = fs.readFileSync(path.join(__dirname, 'base.html'));
const postHtml = fs.readFileSync(path.join(__dirname, 'post.html'));

function buildCode($) {
  $('code[data-snippet]').each((_, el) => {
    const snippet = el.attribs['data-snippet'];
    const code = fs.readFileSync(path.join(snippetsDir, snippet));
    $(`code[data-snippet='${snippet}']`).html(code);
  });
}

function buildCSS($) {
  const css = fs.readFileSync(path.join(__dirname, 'base.css'));

  const output = minifyCSS(css);

  $('head').append(`<style>${output}</style>`);
}

function addHeaders(config) {
  let text = '';

  text += '/\n\tContent-Type: text/html\n\n';

  text += '/index\n\tContent-Type: text/html\n\n';

  config.pages.forEach(page => {
    text += `/${page.out}\n\tContent-Type: text/html\n\n`;
  });

  fs.writeFileSync(path.join(outDir, '_headers'), text);
}

function addPrism() {
  const css = fs.readFileSync(path.join(__dirname, 'prism.css'));

  fs.writeFileSync(path.join(outDir, 'prism.css'), minifyCSS(css));

  fs.copyFileSync(
    path.join(__dirname, 'prism.js'),
    path.join(outDir, 'prism.js')
  );
}

function addRobots() {
  fs.copyFileSync(
    path.join(__dirname, 'robots.txt'),
    path.join(outDir, 'robots.txt')
  );
}

function minifyHtml(html) {
  return minify(html, {
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
    useShortDoctype: true
  });
}

function minifyCSS(css) {
  return new CleanCSS({
    level: 2
  }).minify(css).styles;
}

function buildIndex(config) {
  const $ = cheerio.load(baseHtml);

  if (config.meta && config.meta.title) {
    $('head').append(`<title>${config.meta.title}</title>`);
  }

  if (config.meta && config.meta.description) {
    $('head').append(
      `<meta name="description" content="${config.meta.description}" />`
    );
  }

  buildCSS($);

  config.pages.reverse().forEach(page => {
    const post$ = cheerio.load(postHtml);
    post$('.post-title').html(`<a href="/${page.out}">${page.title}</a>`);
    post$('.post-time').text(page.date);
    post$('.post-description').text(page.description);
    post$('.post-content').append(
      `<p class="post-description">${page.description}</p>`
    );
    $('.site-content').append(post$.html());
  });

  fs.writeFileSync(path.join(outDir, 'index'), minifyHtml($.html()));
}

const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json')));

addPrism();
addRobots();
addHeaders(config);
buildIndex(config);

config.pages.forEach(page => {
  const $ = cheerio.load(baseHtml);

  if (page.code) {
    $('head').append(
      '<link rel="preload" href="prism.css" as="style" onload="this.onload=null;this.rel=\'stylesheet\'">'
    );
    $('head').append('<script defer src="prism.js">');
  }

  if (page.meta && page.meta.title) {
    $('head').append(`<title>${page.meta.title}</title>`);
  }

  if (page.meta && page.meta.description) {
    $('head').append(
      `<meta name="description" content="${page.meta.description}" />`
    );
  }

  const pageHtml = fs.readFileSync(path.join(pagesDir, page.file));

  $('.site-content').html(postHtml);
  $('.post-content').html(pageHtml);
  $('.post-time').text(page.date);
  $('.post-title').text(page.title);

  buildCSS($);
  buildCode($);

  const output = minifyHtml($.html());

  fs.writeFileSync(path.join(outDir, page.out), output);
});
