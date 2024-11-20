import { AsyncLocalStorage } from 'async_hooks';

import { Logger } from 'pino';

import { ConduitScopeBlog } from 'src/database/ConduitClusterTypes.js';
import type { UserId } from 'src/database/models/ids.js';
import { getLogger } from 'src/logger.js';
import { RequiredProps } from 'src/types/RequiredProps.js';
import { hasOwn } from 'src/utils/hasOwn.js';
import { invariant } from 'src/utils/type-guards.js';

export const requestALS = new AsyncLocalStorage<ApiRequestContext>();

export function getUnauthenticatedRequestContext() {
  const store = requestALS.getStore();
  invariant(store, 'Request async context is missing.');

  if (store.logger === undefined) {
    store.logger = getLogger();
  }

  return store as RequiredProps<ApiRequestContext, 'logger'>;
}

export function getRequestContext() {
  const store = requestALS.getStore();
  invariant(store, 'Request async context is missing.');
  invariant(hasOwn(store, 'userId'), 'Request from unauthenticated client.');

  if (store.logger === undefined) {
    store.logger = getLogger();
  }

  return store as RequiredProps<Extract<ApiRequestContext, { userId: string }>, 'logger'>;
}

export type ApiRequestContext =
  | AnonymousApiRequestContext
  | AuthenticatedApiRequestContext;

export type AnonymousApiRequestContext = {
  cb: ConduitScopeBlog;
  logger?: Logger;
  token?: string;
  userId?: UserId;
};

export type AuthenticatedApiRequestContext = {
  cb: ConduitScopeBlog;
  logger?: Logger;
  token: string;
  userId: UserId;
};
