const config = require('config');
const express = require('express');
const fs = require('fs');
const https = require('https');
const _ = require('lodash');
const { getStaffFeePrivilegesByTerm, getStaffFeePrivilegesById } = require('./contrib/contrib');
const { getStaffFeePrivilegesBy } = require('./db/db');
const {
  badRequest,
  notFound,
  errorHandler,
} = require('./errors/errors');
const { authentication } = require('./middlewares/authentication');
const { expressLogger } = require('./middlewares/logger');

// Create HTTPS server
const server = config.get('server');
const app = express();
const httpsOptions = {
  key: fs.readFileSync(server.keyPath),
  cert: fs.readFileSync(server.certPath),
  secureProtocol: server.secureProtocol,
};
const httpsServer = https.createServer(httpsOptions, app);

// Middlewares
app.use(expressLogger);
app.use(authentication);

// GET /staff-fee-privilege
app.get('/staff-fee-privilege', async (req, res) => {
  try {
    const { term } = req.query;
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
    const { id } = req.params;
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

module.exports = { app };
