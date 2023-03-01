const Executable = require('./src/executable');
const Service = require('./src/service');

(async function () {
  await new Executable(async () => {
    const service = new Service();

    await service.execute();
    // await service.shutdown();
  }).run();
}());
