import { beforeEach, describe, expect, it } from 'vitest';

import { getRandomEmail, getRandomUsername } from 'src/utils/getRandom.js';
import {
  createUnauthenticatedTestContext,
  UnauthenticatedTestContext,
} from 'tests/utils/createUnauthenticatedTestContext.js';

describe('registration', () => {
  beforeEach(createUnauthenticatedTestContext);

  it<UnauthenticatedTestContext>('should register a new user with a free username', async ({
    trpcCaller,
  }) => {
    const username = getRandomUsername();
    const email = getRandomEmail();

    const result = await trpcCaller.auth.register({
      user: {
        email,
        username,
        password: 'password',
      },
    });

    expect(result).toEqual({
      user: {
        email,
        username,
        token: expect.any(String),
      },
    });
  });

  it<UnauthenticatedTestContext>('should throw a FORBIDDEN error when trying to register a new user with a used username', async ({
    trpcCaller,
  }) => {
    const username = getRandomUsername();
    const email = getRandomEmail();
    const email2 = getRandomEmail();

    await trpcCaller.auth.register({
      user: {
        email,
        username,
        password: 'password',
      },
    });

    await expect(
      trpcCaller.auth.register({
        user: {
          email: email2,
          username,
          password: 'password',
        },
      })
    ).rejects.toThrowTRPCError('FORBIDDEN');
  });
});
