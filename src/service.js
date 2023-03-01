const logger = require('../lib/logger');

class Service {
  async execute() {
    logger.debug('execute');
  }

}

module.exports = Service;
