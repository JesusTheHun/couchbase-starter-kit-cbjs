
import { initTRPC } from '@trpc/server';

import { errorFormatter } from 'src/trpc/errorFormatter.js';
import { authenticationMiddleware } from 'src/trpc/middlewares/authenticationMiddleware.js';
import { requestContextMiddleware } from 'src/trpc/middlewares/requestContextMiddleware.js';
import { ApiRequestContext } from 'src/trpc/requestALS.js';

export const t = initTRPC.context<ApiRequestContext>().create({
  errorFormatter,
});


export const router = t.router;
export const rawProcedure = t.procedure;
export const publicProcedure = t.procedure.use(requestContextMiddleware);
export const authenticatedProcedure = publicProcedure.use(authenticationMiddleware);
