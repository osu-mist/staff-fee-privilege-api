const config = require('config');
const express = require('express');
const fs = require('fs');
const _ = require('lodash');
const https = require('https');

const { getStaffFeePrivilegesByTerm, getStaffFeePrivilegesById } = require('./contrib/contrib');
const { getStaffFeePrivilegesBy } = require('./db/db');
const { badRequest, internalServerError, notFound } = require('./errors/errors');


// Create HTTPS server
const server = config.get('server');
const privateKey  = fs.readFileSync(server.keyPath, 'utf8');
const certificate = fs.readFileSync(server.certPath, 'utf8');
const credentials = { key: privateKey, cert: certificate };
const app = express();
const httpsServer = https.createServer(credentials, app);

// Error handler
const errorHandler = (res, err) => {
  console.error(err.stack);
  res.status(500).send(internalServerError('The application encountered an unexpected condition.'));
}

// GET /staff-fee-privilege
app.get('/staff-fee-privilege', async (req, res) => {
  try {
    const term = req.query.term;
    if (!term) {
      res.status(400).send(badRequest('Term code need to be provided.'));
    } else {
      const result = await getStaffFeePrivilegesBy(term, getStaffFeePrivilegesByTerm);
      res.send(result);
    }
  } catch (err) {
    errorHandler(res, err);
  }
});

// GET /staff-fee-privilege/:id
app.get('/staff-fee-privilege/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await getStaffFeePrivilegesBy(id, getStaffFeePrivilegesById);

    if (_.isEmpty(result.data)) {
      res.status(404).send(notFound('A staff fee privilege record with the specified ID was not found.'));
    } else {
      res.send(result);
    }
  } catch (err) {
    errorHandler(res, err);
  }
});

// Start HTTPS server
httpsServer.listen(server.port);
