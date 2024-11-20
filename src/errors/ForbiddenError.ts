import { TRPCError } from '@trpc/server';

/**
 * Use when a resource is not found or an association is not valid.
 *
 * Correct:
 * * request to delete an item they can't see
 * * request to get an organization they are not a member of
 * * add a manageable they own to a plan that is not part of their organization
 *
 * Incorrect:
 * * request to delete an item that they can see but doesn't have the permission to delete
 * * request to create a plan but doesn't have the permission
 *
 * @see InsufficientPermissionsError
 */
export class ForbiddenError extends TRPCError {
  constructor(message?: string) {
    super({
      message: message ?? 'Possible reasons include: resource permission, wrong ID.',
      code: 'FORBIDDEN',
    });
  }
}
