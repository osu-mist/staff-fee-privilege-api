const config = require('config');
const express = require('express');

const { getByTerm, getById } = require('./db/db');

const server = config.get('server');
const app = express();

app.get('/staff-fee-privilege', async (req, res) => {
  let term = req.query.term;
  const result = await getByTerm(term);
  res.send(result);
});

app.get('/staff-fee-privilege/:id', async (req, res) => {
  let id = req.params.id;
  const result = await getById(id);
  res.send(result);
});

app.listen(server.port, () => {
  console.log(`${server.name} has started on port ${server.port}`);
});
