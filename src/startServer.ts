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
  const connectionPromise = newCouchbaseConnection();
  const httpServer = createHTTPServer({
    middleware: cors({
      origin: true,
      credentials: true,
    }),
    router: appRouter,
    createContext: async (ctxArgs) => {
      const cb = await connectionPromise;
      return createContext(ctxArgs, { logger, cb });
    },
    onError: ({ error }) => {
      logger.error(error);
    },
  });

  httpServer.listen(appConfig.PORT);
  
  let close = undefined as undefined | Promise<void>;

  return () => {
    if (close) return close;
    
    close = new Promise<void>((res, rej) => {
      httpServer.close((err) => {
        if (err) {
          rej(err);
        }

        res();
      });
    });
    
    return close;
  };
}
