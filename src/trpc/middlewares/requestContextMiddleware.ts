import { AnyTRPCMiddlewareFunction } from '@trpc/server';

import { requestALS } from 'src/trpc/requestALS.js';

export const requestContextMiddleware: AnyTRPCMiddlewareFunction = async ({
  ctx,
  next,
}) => {
  return requestALS.run(ctx, next);
};
