import { AnyTRPCMiddlewareFunction } from '@trpc/server';

import { UnauthenticatedError } from 'src/errors/UnauthenticatedError.js';
import { requestALS } from 'src/trpc/requestALS.js';
import { hasOwn } from 'src/utils/hasOwn.js';

/**
 * A middleware that let through only authenticated users.
 *
 * @see createContext
 */
export const authenticationMiddleware: AnyTRPCMiddlewareFunction = async ({
  ctx,
  next,
}) => {
  if (!hasOwn(ctx, 'userId') || ctx.userId === undefined) {
    throw new UnauthenticatedError();
  }

  const store = requestALS.getStore() as { userId: string };
  store.userId = ctx.userId;

  return next();
};
