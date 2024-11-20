import { TRPCError } from '@trpc/server';

export class UnauthenticatedError extends TRPCError {
  constructor() {
    super({
      message: 'You must authenticated before performing this request.',
      code: 'UNAUTHORIZED',
    });
  }
}
