/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const mkdirp = require('mkdirp');
const CleanCSS = require('clean-css');
const UglifyJS = require('uglify-js');
const minifyHtml = require('html-minifier').minify;

const CONFIG_PATH = path.join(__dirname, '../config.json');
const BUILD_PATH = path.join(__dirname, '../build');
const TEMPLATES_PATH = path.join(__dirname, '../templates');
const STYLES_PATH = path.join(__dirname, '../styles');
const SCRIPTS_PATH = path.join(__dirname, '../js');
const SNIPPETS_PATH = path.join(__dirname, '../snippets');
const POSTS_PATH = path.join(__dirname, '../posts');
const BASE_TEMPLATE = 'base.html';
const BASE_STYLE = 'base.css';

const siteConfig = JSON.parse(fs.readFileSync(CONFIG_PATH));
const baseHtml = fs.readFileSync(path.join(TEMPLATES_PATH, BASE_TEMPLATE));
const baseStyle = new CleanCSS({ level: 2 }).minify(
  fs.readFileSync(path.join(STYLES_PATH, BASE_STYLE)),
).styles;
const posts = fs
  .readdirSync(POSTS_PATH)
  .reverse()
  .map(file => JSON.parse(fs.readFileSync(path.join(POSTS_PATH, file))));

const ignoreFiles = new Set(['_headers', '_redirects']);
const stylesheetsAdded = new Set();
const scriptsAdded = new Set();
const pagesAdded = new Set();

const renderMap = {
  index: buildIndex,
  about: buildAbout,
  projects: buildProjects,
};

function getMinifiedHtml($) {
  return minifyHtml($.html(), {
    minifyCSS: true,
    minifyJS: true,
    collapseBooleanAttributes: true,
    collapseInlineTagWhitespace: true,
    collapseWhitespace: true,
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
}

function buildHeadersFile() {
  const headers = Array.from(pagesAdded).reduce((acc, page) => {
    acc += `/${page}\n`;
    acc += `\tContent-Type: text/html\n\n`;

    return acc;
  }, '');

  fs.writeFileSync(path.join(BUILD_PATH, '_headers'), headers);
}

function buildPage(page, options) {
  options = Object.assign(
    {
      file: page.name,
    },
    options,
  );

  const $ = cheerio.load(baseHtml);

  buildMeta(page.meta, $);
  buildHeader($);
  buildFooter($);
  buildStyle(page.style, $);
  renderMap[page.name](page.data, $);

  pagesAdded.add(options.file);

  fs.writeFileSync(path.join(BUILD_PATH, options.file), getMinifiedHtml($));
}

function buildMeta(meta, $) {
  if (!meta) {
    return;
  }

  const headElem = $('head');

  Object.keys(meta).forEach(key => {
    if (key === 'title') {
      headElem.append(`<title>${meta.title}</title>`);
    } else if (key === 'keywords') {
      headElem.append(
        `<meta name="keywords" content="${siteConfig.commonKeywords},${meta.keywords}">`,
      );
    } else {
      headElem.append(`<meta name="${key}" content="${meta[key]}">`);
    }
  });
}

function buildHeader($) {
  const headerConfig = siteConfig.header;

  if (!siteConfig.header) {
    return;
  }

  const headerElem = $('<div class="header"></div>');
  headerElem.append(`<a href="/" class="title">${siteConfig.name}</a>`);

  if (headerConfig.links) {
    const linksElem = $('<div class="links"></div>');

    headerConfig.links.forEach(link => {
      linksElem.append(`<a href="${link.url}">${link.text}</a>`);
    });

    headerElem.append(linksElem);
  }

  $('body').prepend(headerElem);
}

function buildFooter($) {
  const footerConfig = siteConfig.footer;

  if (!footerConfig) {
    return;
  }

  const footerElem = $('<div class="footer"></div>');

  if (footerConfig.links) {
    const linksElem = $('<div class="links"></div>');

    footerConfig.links.forEach(link => {
      if (link.url.startsWith('/')) {
        linksElem.append(`<a href="${link.url}">${link.text}</a>`);
      } else {
        linksElem.append(`<a href="${link.url}" target="_blank">${link.text}</a>`);
      }
    });

    footerElem.append(linksElem);
  }

  $('body').append(footerElem);
}

function buildStyle(style, $) {
  const pageStyle = style
    ? new CleanCSS({ level: 2 }).minify(fs.readFileSync(path.join(STYLES_PATH, style))).styles
    : '';

  $('head').append(`<style>${baseStyle}${pageStyle}</style>`);
}

function addStylesheet(stylesheet) {
  if (!stylesheetsAdded.has(stylesheet)) {
    stylesheetsAdded.add(stylesheet);

    fs.writeFileSync(
      path.join(BUILD_PATH, stylesheet),
      new CleanCSS({ level: 2 }).minify(fs.readFileSync(path.join(STYLES_PATH, stylesheet))).styles,
    );
  }
}

function addScript(script) {
  if (!scriptsAdded.has(script)) {
    scriptsAdded.add(script);
    fs.writeFileSync(
      path.join(BUILD_PATH, script),
      UglifyJS.minify(String(fs.readFileSync(path.join(SCRIPTS_PATH, script))), {
        mangle: true,
        compress: {
          sequences: true,
          dead_code: true,
          conditionals: true,
          booleans: true,
          unused: true,
          if_return: true,
          join_vars: true,
          drop_console: true,
        },
      }).code,
    );
  }
}

function buildIndex(data, $) {
  const bodyElem = $('.body');
  const postsElem = $('<div class="posts"></div>');

  posts.forEach(post => {
    const postElem = $('<div class="post"></div>');
    postElem.append(`<a href="/${post.file}" class="title">${post.title}</a>`);
    postElem.append(`<div class="date">${post.date}</div>`);
    postsElem.append(postElem);
  });

  bodyElem.append(postsElem);
}

function buildAbout(data, $) {
  const bodyElem = $('.body');
  const linksElem = $('<ul></ul>');

  data.links.forEach(link => {
    const linkElem = $(`<li><a href="${link.url}" target="_blank">${link.text}</span></li>`);

    if (link.label) {
      linkElem.prepend(`<span>${link.label} -&nbsp;</span>`);
    }

    linksElem.append(linkElem);
  });

  bodyElem.append(`<h2>${data.header}</h2>`);
  bodyElem.append(`<p>${data.about}</p>`);
  bodyElem.append(linksElem);
}

function buildProjects(data, $) {
  const bodyElem = $('.body');
  const projectsElem = $('<div class="projects"></div>');

  data.projects.forEach(project => {
    const projectElem = $('<div class="project"></div>');

    projectElem.append(`<div class="name">${project.name}</div>`);
    projectElem.append(`<div class="description">${project.description}</div>`);

    if (project.website) {
      projectElem.append(`<a href="${project.website}" target="_blank" class="link">Website</a>`);
    }

    if (project.source) {
      projectElem.append(`<a href="${project.source}" target="_blank" class="link">Source</a>`);
    }

    projectsElem.append(projectElem);
  });

  bodyElem.append(`<h2>${data.header}</h2>`);
  bodyElem.append(projectsElem);
}

const postRenderMap = {
  header: (data, $) => $(`<h4>${data.value}</h4>`),
  paragraph: (data, $) => $(`<p>${data.value}</p>`),
  code: (data, $) =>
    $(
      `<div class="code-block"><pre><code class="language-${data.syntax}">${fs.readFileSync(
        path.join(SNIPPETS_PATH, data.snippet),
      )}</code></pre></div>`,
    ),
};

function compilePosts() {
  posts.forEach(post => {
    const $ = cheerio.load(baseHtml);
    const bodyElem = $('.body');
    const headElem = $('head');

    headElem.append(`<title>${post.title} - ${siteConfig.name}</title>`);

    buildMeta(post.meta, $);
    buildHeader($);
    buildFooter($);
    buildStyle('post-detail.css', $);

    const wrapperElem = $('<div class="wrapper"></div>');
    const detailElem = $('<div class="post-detail"></div>');
    const contentElem = $('<div class="content"></div>');

    detailElem.append('<a href="/" class="back">Back</a>');
    detailElem.append(`<div class="title">${post.title}</div>`);
    detailElem.append(`<div class="date">${post.date}</div>`);

    post.content.forEach(element => {
      contentElem.append(postRenderMap[element.type](element, $));
    });

    detailElem.append(contentElem);
    wrapperElem.append(detailElem);
    bodyElem.append(wrapperElem);

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

    pagesAdded.add(post.file);

    fs.writeFileSync(path.join(BUILD_PATH, post.file), getMinifiedHtml($));
  });
}

function build() {
  compilePosts();

  siteConfig.pages.forEach(page => {
    buildPage(page);
  });

  buildHeadersFile();

  fs.readdirSync(BUILD_PATH).forEach(file => {
    if (!pagesAdded.has(file) && !stylesheetsAdded.has(file) && !scriptsAdded.has(file)) {
      if (!ignoreFiles.has(file)) {
        fs.unlinkSync(path.join(BUILD_PATH, file));
      }
    }
  });
}

mkdirp(BUILD_PATH, err => {
  if (err) {
    console.error(err);
  } else {
    build();
  }
});
