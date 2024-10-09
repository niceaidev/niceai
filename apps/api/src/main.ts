import { Logger } from '@nestjs/common';

import { NiceAI } from './niceai';

const logger = new Logger();

const run = async () => {
  const app = await NiceAI.init();
  await app.run();
};

run().catch(e => {
  logger.error(e);
  process.exit(1);
});
