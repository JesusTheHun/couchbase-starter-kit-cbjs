import { TRPCError } from '@trpc/server';

export class BusinessLogicError extends TRPCError {
  constructor(message?: string) {
    super({
      message:
        message ??
        'Your request has been understood but cannot be fulfilled. Investigate to make sure the business logic is valid.',
      code: 'UNPROCESSABLE_CONTENT',
    });
  }
}
