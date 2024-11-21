import { beforeEach, describe, expect, it } from 'vitest';

import { getRandomEmail, getRandomUsername } from 'src/utils/getRandom.js';
import {
  AuthenticatedTestContext,
  createAuthenticatedTestContext,
} from 'tests/utils/createAuthenticatedTestContext.js';

describe('updateUser', () => {
  beforeEach(createAuthenticatedTestContext);

  it<AuthenticatedTestContext>('should be able to update your own bio when authenticated', async ({
    trpcCaller,
    requestContext,
    email,
    username,
  }) => {
    await trpcCaller.auth.updateUser({
      user: {
        bio: "It's me, Mario !",
      },
    });

    const result = await trpcCaller.profiles.me();

    expect(result).toEqual({
      user: expect.objectContaining({
        bio: "It's me, Mario !",
      }),
    });
  });

  it<AuthenticatedTestContext>('should throw an UNAUTHORIZED error when trying to update your own bio when unauthenticated', async ({
    trpcCaller,
    requestContext,
    email,
    username,
  }) => {
    // Deauth the user
    requestContext.userId = undefined as never;
    requestContext.token = undefined as never;

    await expect(
      trpcCaller.auth.updateUser({
        user: {
          bio: "It's me, Mario !",
        },
      })
    ).rejects.toThrowTRPCError('UNAUTHORIZED');
  });

  it<AuthenticatedTestContext>('should change the username of a user', async ({
    requestContext,
    trpcCaller,
    cb,
    userId,
  }) => {
    const nextUsername = getRandomUsername();

    await trpcCaller.auth.updateUser({
      user: {
        username: nextUsername,
      },
    });

    requestContext.userId = `user__${nextUsername}`;

    const { user } = await trpcCaller.profiles.me();

    expect(user.username).toEqual(nextUsername);

    const { exists } = await cb.collection('users').exists(userId);
    expect(exists).toBe(false);
  });

  it<AuthenticatedTestContext>('should throw a FORBIDDEN error when trying to change your username for one that is already taken', async ({
    trpcCaller,
    requestContext,
    userId,
    token,
    email,
    username,
  }) => {
    const nextUsername = getRandomUsername();

    // Deauth the user
    requestContext.userId = undefined as never;

    await trpcCaller.auth.register({
      user: {
        email: getRandomEmail(),
        username: nextUsername,
        password: 'password',
      },
    });

    // Reauth the user
    requestContext.userId = userId;

    await expect(
      trpcCaller.auth.updateUser({
        user: {
          username: nextUsername,
        },
      })
    ).rejects.toThrowTRPCError('FORBIDDEN');
  });
});
