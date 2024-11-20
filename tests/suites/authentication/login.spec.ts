import { beforeEach, describe, expect, it } from 'vitest';

import {
  AuthenticatedTestContext,
  createAuthenticatedTestContext,
} from 'tests/utils/createAuthenticatedTestContext.js';

describe('login', () => {
  beforeEach(createAuthenticatedTestContext);

  it<AuthenticatedTestContext>('should be able to login with an existing user', async ({
    trpcCaller,
    requestContext,
    email,
    username,
  }) => {
    // Deauth the user
    requestContext.userId = undefined as never;

    const result = await trpcCaller.auth.login({
      user: {
        email,
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

  // TODO enforce email unicity along with username unicity
  it<AuthenticatedTestContext>('should throw a FORBIDDEN error with the non-existing email', async ({
    trpcCaller,
    requestContext,
    email,
  }) => {
    // Deauth the user
    requestContext.userId = undefined as never;

    await expect(
      trpcCaller.auth.login({
        user: {
          email: 'nope@test.com',
          password: 'password',
        },
      })
    ).rejects.toThrowTRPCError('FORBIDDEN');
  });

  it<AuthenticatedTestContext>('should throw a FORBIDDEN error with the wrong password', async ({
    trpcCaller,
    requestContext,
    email,
  }) => {
    // Deauth the user
    requestContext.userId = undefined as never;

    await expect(
      trpcCaller.auth.login({
        user: {
          email,
          password: 'nope',
        },
      })
    ).rejects.toThrowTRPCError('FORBIDDEN');
  });
});
