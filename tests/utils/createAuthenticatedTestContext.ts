import { RunnerTestCase } from 'vitest';

import { CouchbaseApiConfig } from '@cbjsdev/vitest/utils';

import { ConduitScopeBlog } from 'src/database/ConduitClusterTypes.js';
import { newCouchbaseConnection } from 'src/database/newCouchbaseConnection.js';
import { UserId } from 'src/database/schemas/ids.js';
import { UserAuthenticationOutput } from 'src/domains/authentication/schemas.js';
import { createCaller } from 'src/trpc/context/createCaller.js';
import {
  AnonymousApiRequestContext,
  getUnauthenticatedRequestContext,
  requestALS,
} from 'src/trpc/requestALS.js';
import { getRandomEmail, getRandomUsername } from 'src/utils/getRandom.js';
import { hasOwn } from 'src/utils/hasOwn.js';
import { testLogger } from 'tests/setupLogger.js';
import { waitForAllUsers } from 'tests/utils/waitForAllUsers.js';

export type AuthenticatedTestContext = {
  task: RunnerTestCase<AuthenticatedTestContext>;
  cb: ConduitScopeBlog;
  apiConfig: CouchbaseApiConfig;
  requestContext: AnonymousApiRequestContext;
  trpcCaller: ReturnType<typeof createCaller>;
  userId: UserId;
  email: string;
  username: string;
  token: string;
  user: UserAuthenticationOutput['user'];
};

export async function createAuthenticatedTestContext({ task }: AuthenticatedTestContext) {
  const cb = await newCouchbaseConnection();
  const taskContext = task.context;

  await requestALS.run({ cb, logger: testLogger }, async () => {
    const requestContext = getUnauthenticatedRequestContext();

    const trpcCaller = createCaller(requestContext, {
      onError: ({ error }) => {
        testLogger.error(error);
        if (hasOwn(error, 'cause')) testLogger.error(error.cause?.stack);
      },
    });

    const email = getRandomEmail();
    const username = getRandomUsername();

    const { user } = await trpcCaller.auth.register({
      user: {
        email,
        username,
        password: 'password',
      },
    });

    await waitForAllUsers(cb);

    const userId: UserId = `user__${username}`;

    requestContext.userId = userId;
    requestContext.token = user.token;

    taskContext.cb = requestContext.cb;
    taskContext.requestContext = requestContext;
    taskContext.trpcCaller = trpcCaller;
    taskContext.userId = userId;
    taskContext.email = email;
    taskContext.username = username;
    taskContext.token = user.token;
    taskContext.user = user;
  });
}
