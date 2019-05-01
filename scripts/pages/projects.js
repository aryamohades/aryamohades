module.exports = (data, $) => {
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

  bodyElem.append(`<h1>${data.header}</h1>`);
  bodyElem.append(projectsElem);
};
