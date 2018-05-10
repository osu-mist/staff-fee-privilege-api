const config = require('config');
const moment = require('moment');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');

const loggerConfig = config.get('logger');
const apiName = config.get('api').name;

const logGenerator = () => {
  const pattern = moment().utc().format(`${loggerConfig.pattern}`);
  return `${apiName}-${pattern}.log`;
};

const LogStream = rfs(logGenerator, {
  interval: loggerConfig.interval,
  size: loggerConfig.size,
  path: loggerConfig.path,
  compress: loggerConfig.compress,
  maxFiles: loggerConfig.maxFiles,
});

const stdoutlogger = morgan('dev');
const rfsLogger = morgan('combined', { stream: LogStream });

module.exports = { stdoutlogger, rfsLogger };
