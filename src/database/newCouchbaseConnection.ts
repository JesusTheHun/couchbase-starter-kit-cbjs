import { connect } from '@cbjsdev/cbjs';
import JSONBigInt from 'json-bigint';

import { appConfig } from 'src/config.js';
import { ConduitClusterTypes } from 'src/database/ConduitClusterTypes.js';

/**
 * Return the `blog` Scope, using a new connection to the Couchbase cluster.
 * You should avoid creating new connections as much as possible and reuse the existing ones.
 */
export async function newCouchbaseConnection() {
  return await connect<ConduitClusterTypes>(appConfig.CB_CONNECTION_STRING, {
    username: appConfig.CB_USER,
    password: appConfig.CB_PASSWORD,
    queryResultParser: JSONBigInt({ useNativeBigInt: true }).parse,
    timeouts: {
      connectTimeout: 200,
      kvTimeout: 200,
    },
  }).then((cb) => cb.bucket('conduit').scope('blog'));
}
