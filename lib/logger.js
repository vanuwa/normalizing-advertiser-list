const bunyan = require('bunyan');
const settings = require('config');
const name = settings.get('app.name');

let level = settings.get('app.log_level');

level = level.toUpperCase() === 'ALL' ? 'TRACE' : level;
level = level.toUpperCase() === 'OFF' ? 'FATAL' : level;

// It's for StackDriver on GCP
const severity_map = {
  trace: 'DEBUG',
  debug: 'DEBUG',
  info: 'INFO',
  warn: 'WARNING',
  error: 'ERROR',
  fatal: 'CRITICAL'
};

const default_options = { name, level, serializers: bunyan.stdSerializers, stream: process.stdout, src: false };

const createExtension = function createExtension (logger = bunyan.createLogger(default_options)) {
  return Object.entries(severity_map).reduce((accumulator, [key, value]) => {
    const log = logger.child({ severity: value }, false);

    accumulator[key] = log[key].bind(log);

    return accumulator;
  }, {});
};

const createLogger = function createLogger (options = {}) {
  const logger = bunyan.createLogger(Object.assign({}, default_options, options));

  const extension = createExtension(logger);

  return Object.assign({}, extension, { createLogger });
};

module.exports = createLogger(default_options);
