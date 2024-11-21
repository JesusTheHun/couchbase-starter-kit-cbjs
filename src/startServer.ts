import { log } from 'node:util';
import { promisify } from 'util';

import { createHTTPServer } from '@trpc/server/adapters/standalone';
import cors from 'cors';
import { Logger } from 'pino';

import { appConfig } from 'src/config.js';
import { newCouchbaseConnection } from 'src/database/newCouchbaseConnection.js';
import { appRouter } from 'src/trpc/appRouter.js';
import { createContext } from 'src/trpc/context/createContext.js';

/**
 * Start the tRPC server and returns a function to shut it down.
 */
export function startServer({ logger }: { logger: Logger }) {
  const httpServer = createHTTPServer({
    middleware: cors({
      origin: true,
      credentials: true,
    }),
    router: appRouter,
    createContext: async (ctxArgs) => {
      const cb = await newCouchbaseConnection();
      return createContext(ctxArgs, { logger, cb });
    },
    onError: ({ path, error, input }) => {
      logger.error(error);
    },
  });

  httpServer.listen(appConfig.PORT);

  const close = promisify(httpServer.close).bind(httpServer);
  return async () => await close();
}
