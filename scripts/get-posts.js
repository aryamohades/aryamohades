const fs = require('fs');
const path = require('path');
const POSTS_PATH = path.join(__dirname, '../posts');

const posts = fs
  .readdirSync(POSTS_PATH)
  .reverse()
  .map(file => JSON.parse(fs.readFileSync(path.join(POSTS_PATH, file))));

module.exports = posts;
