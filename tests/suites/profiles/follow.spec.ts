import { beforeEach, describe, expect, it } from 'vitest';

import { getRandomEmail, getRandomUsername } from 'src/utils/getRandom.js';
import {
  AuthenticatedTestContext,
  createAuthenticatedTestContext,
} from 'tests/utils/createAuthenticatedTestContext.js';

describe('follow', () => {
  beforeEach(createAuthenticatedTestContext);

  it<AuthenticatedTestContext>('should add the username to the list of followed profile', async ({
    trpcCaller,
    cb,
    userId,
  }) => {
    const nextUsername = getRandomUsername();

    await trpcCaller.auth.register({
      user: {
        email: getRandomEmail(),
        username: nextUsername,
        password: 'password',
      },
    });

    await trpcCaller.profiles.follow({
      username: nextUsername,
    });

    // We check the document content
    const { content: userDoc } = await cb.collection('users').get(userId);
    expect(Object.keys(userDoc.follows)).toContain(`user__${nextUsername}`);

    // We check it's reflected through the API
    const followedProfile = await trpcCaller.profiles.get({ username: nextUsername });
    expect(followedProfile.profile.following).toBe(true);
  });

  it<AuthenticatedTestContext>('should throw a FORBIDDEN error when trying to follow a profile who doesnt exist', async ({
    trpcCaller,
    cb,
    userId,
  }) => {
    await expect(
      trpcCaller.profiles.follow({
        username: 'missingUsername',
      })
    ).rejects.toThrowTRPCError('FORBIDDEN');
  });
});
