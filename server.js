const config = require('config');
const express = require('express');

const { getStaffFeePrivileges } = require('./db/db');

const server = config.get('server');
const app = express();

app.get('/staff-fee-privilege', async (req, res) => {
  let term = req.query.term;
  const result = await getStaffFeePrivileges(term);
  res.send(result);
});

app.listen(server.port, () => {
  console.log(`${server.name} has started on port ${server.port}`);
});
