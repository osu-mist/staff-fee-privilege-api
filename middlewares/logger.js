const config = require('config');
const expressWinston = require('express-winston');
const winston = require('winston');
require('winston-daily-rotate-file');

const loggerConfig = config.get('logger');
const apiName = config.get('api').name;

// Transport for daily rotate file
const dailyRotateFileTransport = new (winston.transports.DailyRotateFile)({
  filename: `${apiName}-%DATE%.log`,
  datePattern: loggerConfig.pattern,
  maxSize: loggerConfig.size,
  zippedArchive: loggerConfig.archive,
  maxFiles: loggerConfig.maxFiles,
  dirname: loggerConfig.path,
});

// Transport for console output
const consoleTransport = new winston.transports.Console({
  json: loggerConfig.jsonConsole,
  colorize: loggerConfig.colorize,
});

const logger = expressWinston.logger({
  transports: [dailyRotateFileTransport, consoleTransport],
  expressFormat: true,
  colorize: loggerConfig.colorize,
});

module.exports = { logger };
