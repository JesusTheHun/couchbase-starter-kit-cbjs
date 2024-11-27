import { RunnerTestCase } from 'vitest';

import { CouchbaseApiConfig } from '@cbjsdev/vitest/utils';

import { ConduitScopeBlog } from 'src/database/ConduitClusterTypes.js';
import { newCouchbaseConnection } from 'src/database/newCouchbaseConnection.js';
import { createCaller } from 'src/trpc/context/createCaller.js';
import {
  AnonymousApiRequestContext,
  getUnauthenticatedRequestContext,
  requestALS,
} from 'src/trpc/requestALS.js';
import { testLogger } from 'tests/setupLogger.js';

export type UnauthenticatedTestContext = {
  task: RunnerTestCase<UnauthenticatedTestContext>;
  cb: ConduitScopeBlog;
  apiConfig: CouchbaseApiConfig;
  requestContext: AnonymousApiRequestContext;
  trpcCaller: ReturnType<typeof createCaller>;
};

export async function createUnauthenticatedTestContext({
  task,
}: UnauthenticatedTestContext) {
  const cb = await newCouchbaseConnection();
  const taskContext = task.context;

  await requestALS.run({ cb, logger: testLogger }, async () => {
    const requestContext = getUnauthenticatedRequestContext();

    const trpcCaller = createCaller(requestContext, {
      onError: (err) => {
        testLogger.error(err);
      },
    });

    taskContext.cb = requestContext.cb;
    taskContext.requestContext = requestContext;
    taskContext.trpcCaller = trpcCaller;
  });
}
