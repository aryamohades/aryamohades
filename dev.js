/* eslint-disable no-console */
const path = require('path');
const express = require('express');

const app = express();

app.use((req, res, next) => {
  if (req.path.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css');
  } else if (req.path.endsWith('.js')) {
    res.setHeader('Content-Type', 'text/javascript');
  } else {
    res.setHeader('Content-Type', 'text/html');
  }

  next();
});

const STATIC_DIR = path.join(__dirname, 'build');

app.get('/', (req, res) => {
  res.sendFile(path.join(STATIC_DIR, 'index'));
});

app.use(express.static(STATIC_DIR, { extensions: ['html', 'css'] }));

app.listen(8080, () => console.log('ready'));
