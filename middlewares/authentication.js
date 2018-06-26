require('dotenv').config();
const config = require('config');
const basicAuth = require('express-basic-auth');
const { unauthorized } = require('../errors/errors');

const { username, password } = config.authentication;
const authentication = basicAuth({
  users: { [process.env.USER || username]: process.env.PASSWD || password },
  unauthorizedResponse: unauthorized,
});

module.exports = { authentication };
