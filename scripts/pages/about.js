module.exports = (data, $) => {
  const bodyElem = $('.body');
  const linksElem = $('<ul></ul>');

  data.links.forEach(link => {
    const linkElem = $(`<li><a href="${link.url}" target="_blank">${link.text}</span></li>`);

    if (link.label) {
      linkElem.prepend(`<span>${link.label} -&nbsp;</span>`);
    }

    linksElem.append(linkElem);
  });

  bodyElem.append(`<h1>${data.header}</h1>`);
  bodyElem.append(`<p>${data.about}</p>`);
  bodyElem.append(linksElem);
};
