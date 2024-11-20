import { UserId } from 'src/database/models/ids.js';
import { ForbiddenError } from 'src/errors/ForbiddenError.js';
import { getRequestContext } from 'src/trpc/requestALS.js';

export async function followUser(username: string): Promise<void> {
  const { userId, cb } = getRequestContext();
  const targetUserId: UserId = `user__${username}`;

  const { exists } = await cb.collection('users').exists(targetUserId);

  if (!exists) {
    throw new ForbiddenError('User not found');
  }

  await cb
    .collection('users')
    .mutateIn(userId)
    .upsert(`follows.${targetUserId}`, { since: Date.now() });
}
