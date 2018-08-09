const config = require('config');
const express = require('express');
const fs = require('fs');
const git = require('simple-git/promise');
const https = require('https');
const moment = require('moment');
const db = require('./db/db');
const { badRequest, notFound, errorHandler } = require('./errors/errors');
const { authentication } = require('./middlewares/authentication');
const { logger } = require('./middlewares/logger');

// Create Express application
const serverConfig = config.get('server');
const app = express();
const appRouter = express.Router();
const adminApp = express();
const adminAppRouter = express.Router();

// Middlewares
if (logger) app.use(logger);
app.use(serverConfig.basePath, appRouter);
appRouter.use(authentication);

adminApp.use(serverConfig.basePath, adminAppRouter);
adminAppRouter.use(authentication);
adminAppRouter.use('/healthcheck', require('express-healthcheck')());

// GET /
adminAppRouter.get('/', async (req, res) => {
  try {
    const commit = await git().revparse(['--short', 'HEAD']);
    const now = moment();
    const info = {
      name: `${config.get('api').name}-api`,
      time: now.format('YYYY-MM-DD HH:mm:ssZZ'),
      unixTime: now.unix(),
      commit: commit.trim(),
      documentation: 'swagger.yaml',
    };
    res.send(info);
  } catch (err) {
    errorHandler(res, err);
  }
});

// GET /staff-fee-privilege
appRouter.get('/staff-fee-privilege', async (req, res) => {
  try {
    const { query } = req;
    if (!query.term && !query.osuId) {
      res.status(400).send(badRequest('Term code or OSU ID need to be provided.'));
    } else {
      const result = await db.getStaffFeePrivilegesByQuery(query);
      res.send(result);
    }
  } catch (err) {
    errorHandler(res, err);
  }
});

// GET /staff-fee-privilege/:id
appRouter.get('/staff-fee-privilege/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [osuId, term] = id.split('-');
    const result = await db.getStaffFeePrivilegesById({ osuId, term });
    if (!result) {
      res.status(404).send(notFound('A staff fee privilege record with the specified ID was not found.'));
    } else {
      res.send(result);
    }
  } catch (err) {
    errorHandler(res, err);
  }
});

// Create and start HTTPS servers
const httpsOptions = {
  key: fs.readFileSync(serverConfig.keyPath),
  cert: fs.readFileSync(serverConfig.certPath),
  secureProtocol: serverConfig.secureProtocol,
};
const httpsServer = https.createServer(httpsOptions, app);
const adminHttpsServer = https.createServer(httpsOptions, adminApp);
httpsServer.listen(serverConfig.port);
adminHttpsServer.listen(serverConfig.adminPort);

module.exports = { app };
