const express = require('express');
const path = require('path');

const app = express();

app.get('/js/*', (req, res) => {
  const urlPath = req.path;
  res.sendFile(path.resolve(app.get('appPath') + '/../dist/' + urlPath));
});

app.get('/', (req, res) => {
  res.sendFile(path.resolve(app.get('appPath') + '/../dist/index.html'));
});

app.listen(3333, () => {
  console.log('App listening on localhost:3333');
});
