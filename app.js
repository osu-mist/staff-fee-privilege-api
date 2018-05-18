const config = require('config');
const express = require('express');
const fs = require('fs');
const https = require('https');
const _ = require('lodash');
const db = require('./db/db');
const { badRequest, notFound, errorHandler } = require('./errors/errors');
const { authentication } = require('./middlewares/authentication');
const { stdoutlogger, rfsLogger } = require('./middlewares/logger');

// Create HTTPS servers
const serverConfig = config.get('server');
const app = express();
const adminApp = express();
const httpsOptions = {
  key: fs.readFileSync(serverConfig.keyPath),
  cert: fs.readFileSync(serverConfig.certPath),
  secureProtocol: serverConfig.secureProtocol,
};
const httpsServer = https.createServer(httpsOptions, app);
const adminHttpsServer = https.createServer(httpsOptions, adminApp);

// Middlewares
app.use(stdoutlogger);
app.use(rfsLogger);
app.use(authentication);
adminApp.use(authentication);
adminApp.use('/healthcheck', require('express-healthcheck')());

// GET /staff-fee-privilege
app.get('/staff-fee-privilege', async (req, res) => {
  try {
    const params = req.query;
    if (!params) {
      res.status(400).send(badRequest('Term code or OSU ID need to be provided.'));
    } else {
      const result = await db.getStaffFeePrivilegesByParams(params);
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
    const result = await db.getStaffFeePrivilegesById(id);
    if (_.isEmpty(result.data)) {
      res.status(404).send(notFound('A staff fee privilege record with the specified ID was not found.'));
    } else {
      res.send(result);
    }
  } catch (err) {
    errorHandler(res, err);
  }
});

// Start HTTPS servers
httpsServer.listen(serverConfig.port);
adminHttpsServer.listen(serverConfig.adminPort);

module.exports = { app };
