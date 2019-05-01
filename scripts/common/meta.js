const { SITE_CONFIG } = require('../constants');

module.exports = (meta, $) => {
  if (!meta) {
    return;
  }

  const headElem = $('head');

  Object.keys(meta).forEach(key => {
    if (key === 'title') {
      headElem.append(`<title>${meta.title}</title>`);
    } else if (key === 'keywords') {
      headElem.append(
        `<meta name="keywords" content="${SITE_CONFIG.commonKeywords},${meta.keywords}">`,
      );
    } else {
      headElem.append(`<meta name="${key}" content="${meta[key]}">`);
    }
  });
};
