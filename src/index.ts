import './configure-arktype.js';
import './instrument.js';

import 'tslib';
import { appLogger } from "src/logger.js";

import { startServer } from 'src/startServer.js';
import { appConfig } from './config.js';

const closeServer = startServer({ logger: appLogger });

process.on('SIGINT', () => {
  console.log('Received SIGINT. Gracefully shutting down...');

  setTimeout(() => {
    console.error('Graceful shutdown timeout. Forcing shutdown.');
    process.exit(1);
  }, 10_000);

  closeServer()
    .then(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
});

console.info(`Listening on port ${appConfig.PORT}`);
