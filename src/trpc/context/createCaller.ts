import { appRouter } from 'src/trpc/appRouter.js';
import { t } from 'src/trpc/trpc.js';

export const createCaller = t.createCallerFactory(appRouter);
