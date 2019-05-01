const posts = require('../get-posts');

module.exports = (data, $) => {
  const bodyElem = $('.body');
  const postsElem = $('<div class="posts"></div>');

  posts.forEach(post => {
    const postElem = $('<div class="post"></div>');
    postElem.append(`<h5><a href="/${post.file}">${post.title}</a></h5>`);
    postElem.append(`<div class="date">${post.date}</div>`);
    postsElem.append(postElem);
  });

  bodyElem.append(`<h1>${data.header}</h1>`);
  bodyElem.append(postsElem);
};
