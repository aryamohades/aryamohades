const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, '../config.json');
const BUILD_PATH = path.join(__dirname, '../build');
const CONTENT_PATH = path.join(__dirname, '../content');
const TEMPLATES_PATH = path.join(__dirname, '../templates');
const STYLES_PATH = path.join(CONTENT_PATH, 'styles');
const SCRIPTS_PATH = path.join(CONTENT_PATH, 'js');
const SNIPPETS_PATH = path.join(CONTENT_PATH, 'snippets');
const IMAGES_PATH = path.join(CONTENT_PATH, 'images');
const POSTS_PATH = path.join(CONTENT_PATH, 'posts');
const SITE_CONFIG = JSON.parse(fs.readFileSync(CONFIG_PATH));
const BASE_HTML = fs.readFileSync(path.join(TEMPLATES_PATH, 'base.html'));
const BASE_STYLE = fs.readFileSync(path.join(STYLES_PATH, 'base.css'));

module.exports = {
  CONFIG_PATH,
  BUILD_PATH,
  TEMPLATES_PATH,
  STYLES_PATH,
  SCRIPTS_PATH,
  SNIPPETS_PATH,
  IMAGES_PATH,
  POSTS_PATH,
  BASE_HTML,
  BASE_STYLE,
  SITE_CONFIG,
};
