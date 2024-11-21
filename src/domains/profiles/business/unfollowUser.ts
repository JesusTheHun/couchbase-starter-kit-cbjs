import { UserId } from 'src/database/models/ids.js';
import { ForbiddenError } from 'src/errors/ForbiddenError.js';
import { getRequestContext } from 'src/trpc/requestALS.js';

export async function unfollowUser(username: string): Promise<void> {
  const { userId, cb } = getRequestContext();
  const targetUserId: UserId = `user__${username}`;

  await cb
    .collection('users')
    .mutateIn(userId)
    // This little trick allows us to not check the existence of the property and skip a network trip
    .upsert(`follows.${targetUserId}`, null as never)
    .remove(`follows.${targetUserId}`);
}
