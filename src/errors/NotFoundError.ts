import { TRPCError } from '@trpc/server';

export class NotFoundError extends TRPCError {
  constructor(message?: string) {
    super({
      message: message,
      code: 'NOT_FOUND',
    });
  }
}
