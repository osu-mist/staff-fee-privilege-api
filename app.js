const basicAuth = require('express-basic-auth');
const config = require('config');
const express = require('express');
const fs = require('fs');
const https = require('https');
const moment = require('moment');
const morgan = require('morgan');
const path = require('path');
const rfs = require('rotating-file-stream');
const _ = require('lodash');
const { getStaffFeePrivilegesByTerm, getStaffFeePrivilegesById } = require('./contrib/contrib');
const { getStaffFeePrivilegesBy } = require('./db/db');
const {
  badRequest,
  unauthorized,
  notFound,
  internalServerError,
} = require('./errors/errors');

// Create HTTPS server
const server = config.get('server');
const app = express();
const httpsOptions = {
  key: fs.readFileSync(server.keyPath, 'utf8'),
  cert: fs.readFileSync(server.certPath, 'utf8'),
  secureProtocol: server.secureProtocol,
};
const httpsServer = https.createServer(httpsOptions, app);

// Use logger middleware with standard Apache combined log format
const logger = config.get('logger');
const api = config.get('api');
const logsDirectory = path.join(__dirname, logger.logsDirectory);
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory);
}
const logGenerator = () => `${api.name}-${moment.utc().format('MM-DD-YYYY')}.log`;
const logStream = rfs(logGenerator, {
  interval: '1m',
  path: logsDirectory,
});
app.use(morgan('combined', { stream: logStream }));

// Basic authentication middleware
const { username, password } = config.authentication;
app.use(basicAuth({
  users: { [username]: password },
  unauthorizedResponse: unauthorized,
}));

// Error handler
const errorHandler = (res, err) => {
  console.error(err.stack);
  res.status(500).send(internalServerError('The application encountered an unexpected condition.'));
};

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
