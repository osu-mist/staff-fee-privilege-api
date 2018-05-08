const config = require('config');
const log4js = require('log4js');

const apiConfig = config.get('api');
const loggerConfig = config.get('logger');

log4js.configure({
  appenders: {
    dateFile: {
      type: 'dateFile',
      filename: `${loggerConfig.logsDirectory}/${apiConfig.name}.log`,
      pattern: `-${loggerConfig.pattern}`,
      compress: true,
    },
    out: {
      type: 'stdout',
    },
  },
  categories: {
    default: { appenders: ['dateFile', 'out'], level: loggerConfig.level },
  },
});
const logger = log4js.getLogger();
const expressLogger = log4js.connectLogger(logger);

module.exports = { expressLogger };
