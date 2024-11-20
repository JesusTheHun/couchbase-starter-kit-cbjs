import { TRPCError } from '@trpc/server';

/**
 * Use when you detect that the app is in a state it should not be possible to be in.
 */
export class InconsistencyError extends TRPCError {
  context: unknown;

  constructor(message: string, context?: unknown) {
    super({
      message,
      code: 'INTERNAL_SERVER_ERROR',
    });

    this.context = context;
  }
}
