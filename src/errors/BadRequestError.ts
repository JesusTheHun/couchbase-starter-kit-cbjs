import { TRPCError } from '@trpc/server';

export class BadRequestError extends TRPCError {
  constructor(message?: string) {
    super({
      message:
        message ??
        'Your request is invalid. Check the documentation to verify its format.',
      code: 'BAD_REQUEST',
    });
  }
}
