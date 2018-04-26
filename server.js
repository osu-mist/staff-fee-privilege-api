const express = require('express');

const config = require('./config/config');

const app = express();

app.get('/staff-fee-privilege', (req, res) => {
  let term = req.query.term;
  console.log(`term: ${term}`);
  res.send('Hello Node.js!');
});

app.listen(config.server.port, () => {
  console.log(`staff-fee-privilege API has started on port ${config.server.port}`);
});
