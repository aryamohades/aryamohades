const { SITE_CONFIG } = require('../constants');

module.exports = $ => {
  const headerConfig = SITE_CONFIG.header;

  if (!SITE_CONFIG.header) {
    return;
  }

  const headerElem = $('<div class="header"></div>');
  headerElem.append(`<a href="/" class="title">${SITE_CONFIG.name}</a>`);

  if (headerConfig.links) {
    const linksElem = $('<div class="links"></div>');

    headerConfig.links.forEach(link => {
      linksElem.append(`<a href="${link.url}">${link.text}</a>`);
    });

    headerElem.append(linksElem);
  }

  $('body').prepend(headerElem);
};
