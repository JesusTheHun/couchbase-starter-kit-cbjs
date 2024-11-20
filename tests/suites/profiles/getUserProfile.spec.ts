import { beforeEach, describe, expect, it } from 'vitest';

import {
  AuthenticatedTestContext,
  createAuthenticatedTestContext,
} from 'tests/utils/createAuthenticatedTestContext.js';

describe('getUserProfile', () => {
  beforeEach(createAuthenticatedTestContext);

  it<AuthenticatedTestContext>('should get the user profile without the `followed` property, when unauthenticated', async ({
    trpcCaller,
    requestContext,
    userId,
    username,
  }) => {
    // Deauth
    requestContext.userId = undefined as never;

    const result = await trpcCaller.profiles.get({ username });

    expect(result).toEqual({
      profile: {
        username,
      },
    });
  });

  it<AuthenticatedTestContext>('should get the user profile with the `followed` property, when authenticated', async ({
    trpcCaller,
    username,
  }) => {
    const result = await trpcCaller.profiles.get({ username });

    expect(result).toEqual({
      profile: {
        username,
        following: false,
      },
    });
  });
});
