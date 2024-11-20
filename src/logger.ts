import { Logger, pino, stdTimeFunctions } from 'pino';

import { appConfig } from 'src/config.js';

export function setLogger(logger: Logger) {
  appLogger = logger;
}

export function getLogger(): Logger {
  return appLogger;
}

export let appLogger: Logger = pino({
  enabled: appConfig.LOG_ENABLED,
  level: appConfig.LOG_LEVEL,
  timestamp: stdTimeFunctions.isoTime,
  transport: {
    target: 'pino/file',
    options: {
      destination: `server.log`,
      mkdir: true,
      append: true,
      sync: true,
    },
  },
});
