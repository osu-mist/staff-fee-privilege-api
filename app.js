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

const api = config.get('api').name;

// Create HTTPS server
const serverConfig = config.get('server');
const app = express();
const httpsOptions = {
  key: fs.readFileSync(serverConfig.keyPath),
  cert: fs.readFileSync(serverConfig.certPath),
  secureProtocol: serverConfig.secureProtocol,
};
const httpsServer = https.createServer(httpsOptions, app);

// Middlewares
app.use(expressLogger);
app.use(authentication);
app.use(`/${api}/healthcheck`, require('express-healthcheck')());

// GET /staff-fee-privilege
app.get(`/${api}`, async (req, res) => {
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
app.get(`/${api}/:id`, async (req, res) => {
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
httpsServer.listen(serverConfig.port);

module.exports = { app };
