const fs = require('fs');
const path = require('path');
const { BUILD_PATH, IMAGES_PATH } = require('../constants');

module.exports = () => {
  fs.readdirSync(IMAGES_PATH).forEach(image => {
    if (image.endsWith('.jpg') || image.endsWith('.jpeg') || image.endsWith('.png')) {
      fs.copyFileSync(path.join(IMAGES_PATH, image), path.join(BUILD_PATH, image));
    }
  });
};
