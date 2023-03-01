const logger = require('../lib/logger');

class Executable {
  constructor (action = () => {}, context) {
    this.start_time = process.hrtime();
    this.action = action;
    this.context = context;

    process.on('SIGINT', this.shutdown);
    process.on('SIGTERM', this.shutdown);
  }

  run () {
    logger.info('[ * ] Processing...');

    const { action, context = undefined } = this;

    return new Promise((resolve) => {
      if (context && Array.isArray(context)) {
        return resolve(action.call(context));
      }

      return resolve(action.apply(context));
    })
      .then(() => logger.info('[ SUCCESS ] Processing DONE.'))
      .catch((exception) => {
        logger.error({ err: exception });
        logger.error('[ FAIL ] Processing FAILED.');

        return exception;
      })
      .finally(() => this.shutdown());
  }

  shutdown () {
    this.end_time = process.hrtime(this.start_time);
    const seconds = this.end_time[0];
    const milliseconds = this.end_time[1] / 1000000;

    logger.info('Execution time: %ds %dms', seconds, milliseconds);
    logger.info('DONE');

    return process.exit();
  }
}

module.exports = Executable;
