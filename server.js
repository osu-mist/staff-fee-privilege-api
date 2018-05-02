const config = require('config');
const express = require('express');
const fs = require('fs');
const https = require('https');

const { getStaffFeePrivilegesByTerm, getStaffFeePrivilegesById } = require('./contrib/contrib');
const { getStaffFeePrivilegesBy } = require('./db/db');

// Create HTTPS server
const server = config.get('server');
const privateKey  = fs.readFileSync(server.keyPath, 'utf8');
const certificate = fs.readFileSync(server.certPath, 'utf8');
const credentials = { key: privateKey, cert: certificate };
const app = express();
const httpsServer = https.createServer(credentials, app);

// GET /staff-fee-privilege
app.get('/staff-fee-privilege', async (req, res) => {
  let term = req.query.term;
  const result = await getStaffFeePrivilegesBy(term, getStaffFeePrivilegesByTerm);
  res.send(result);
});

// GET /staff-fee-privilege/:id
app.get('/staff-fee-privilege/:id', async (req, res) => {
  let id = req.params.id;
  const result = await getStaffFeePrivilegesBy(id, getStaffFeePrivilegesById);
  res.send(result);
});

// Start HTTPS server
httpsServer.listen(server.port);
