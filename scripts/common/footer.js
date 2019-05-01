const { SITE_CONFIG } = require('../constants');

module.exports = $ => {
  const footerConfig = SITE_CONFIG.footer;

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
};
