const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');

const CONFIG_PATH = path.join(__dirname, '../config.json');
const BUILD_PATH = path.join(__dirname, '../build');
const TEMPLATES_PATH = path.join(__dirname, '../templates');
const STYLES_PATH = path.join(__dirname, '../styles');
const SCRIPTS_PATH = path.join(__dirname, '../js');
const SNIPPETS_PATH = path.join(__dirname, '../snippets');
const IMAGES_PATH = path.join(__dirname, '../images');
const POSTS_PATH = path.join(__dirname, '../posts');
const SITE_CONFIG = JSON.parse(fs.readFileSync(CONFIG_PATH));
const BASE_HTML = fs.readFileSync(path.join(TEMPLATES_PATH, 'base.html'));
const BASE_STYLE = new CleanCSS({ level: 2 }).minify(
  fs.readFileSync(path.join(STYLES_PATH, 'base.css')),
).styles;
const IGNORE_FILES = new Set(['_headers', '_redirects']);

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
  IGNORE_FILES,
}