import { type } from 'arktype';
import { config } from 'dotenv';

import { stringToBoolean } from 'src/utils/stringToBoolean.js';

const arkConfig = type({
  PORT: type('string.numeric.parse'),
  ENVIRONMENT: type("'production' | 'development' | 'test' | 'staging'").default(
    'development'
  ),
  CB_CONNECTION_STRING: 'string',
  CB_USER: 'string',
  CB_PASSWORD: 'string',
  LOG_ENABLED: type('string').pipe(stringToBoolean),
  LOG_LEVEL: type("'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace'"),
  JWT_SECRET: type('string'),
}).onUndeclaredKey('delete');

const appConfig = {} as typeof arkConfig.infer;

try {
  config({ path: `.env` });
  Object.assign(appConfig, arkConfig.assert(process.env));
} catch (err) {
  console.error(err);
  process.exit(9);
}

export { appConfig };
