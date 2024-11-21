import { Scope } from '@cbjsdev/cbjs';
import { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone';
import { Logger } from 'pino';

import { ConduitScopeBlog } from 'src/database/ConduitClusterTypes.js';
import { getJwtFromHeaders } from 'src/utils/getJwtFromHeaders.js';
import { getRandomId } from 'src/utils/getRandom.js';
import { getUserIdFromJwt } from 'src/utils/getUserIdFromJwt.js';

export function createContext(
  { req }: CreateHTTPContextOptions,
  { logger, cb }: { logger: Logger; cb: ConduitScopeBlog }
) {
  const requestId = getRandomId();
  const requestLogger = logger.child({
    requestId,
  });

  const token = getJwtFromHeaders(req);
  const userId = token ? getUserIdFromJwt(token) : undefined;

  return {
    cb: cb as Scope<any, any, any>, // TODO is the casting necessary ?
    logger: requestLogger,
    request: req,
    token,
    userId,
  };
}
