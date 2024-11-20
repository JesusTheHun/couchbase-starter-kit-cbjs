import { beforeEach, describe, expect, it } from 'vitest';

import { getRandomEmail, getRandomUsername } from 'src/utils/getRandom.js';
import {
  AuthenticatedTestContext,
  createAuthenticatedTestContext,
} from 'tests/utils/createAuthenticatedTestContext.js';

describe('unfollow', () => {
  beforeEach(createAuthenticatedTestContext);

  it<AuthenticatedTestContext>('should remove the username from the list of followed profile', async ({
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

    await trpcCaller.profiles.unfollow({
      username: nextUsername,
    });

    // We check the document content
    const { content: userDoc } = await cb.collection('users').get(userId);
    expect(Object.keys(userDoc.follows)).not.toContain(`user__${nextUsername}`);

    // We check it's reflected through the API
    const followedProfile = await trpcCaller.profiles.get({ username: nextUsername });
    expect(followedProfile.profile.following).toBe(false);
  });

  it<AuthenticatedTestContext>('should be a silent no-op to unfollow a profile that is not followed', async ({
    trpcCaller,
    cb,
    userId,
  }) => {
    await expect(
      trpcCaller.profiles.unfollow({
        username: 'missingUsername',
      })
    ).resolves.toBeUndefined();
  });
});
