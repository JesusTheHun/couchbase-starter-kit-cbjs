import { connect } from '@cbjsdev/cbjs';
import {
  applyCouchbaseClusterChanges,
  getCouchbaseClusterChanges,
} from '@cbjsdev/deploy';
import { getApiConfig } from '@cbjsdev/vitest/utils';
import type { GlobalSetupContext } from 'vitest/node';

import { appConfig } from 'src/config.js';
import { clusterConfig } from 'src/database/conduitClusterConfig.js';
import { testLogger } from 'tests/setupLogger.js';

export async function setup({ config }: GlobalSetupContext) {
  const cluster = await connect(appConfig.CB_CONNECTION_STRING, {
    username: process.env.CB_ADMIN_USER,
    password: process.env.CB_ADMIN_PASSWORD,
  });

  const defaultApiConfig = getApiConfig(false);
  const apiConfig = {
    ...defaultApiConfig,
    credentials: {
      username: process.env.CB_ADMIN_USER!,
      password: process.env.CB_ADMIN_PASSWORD!,
    },
  };

  let currentConfig = {};

  const buckets = await cluster.buckets().getAllBuckets();

  if (buckets.some((b) => b.name === 'conduit')) {
    const result = await cluster
      .bucket('conduit')
      .defaultCollection()
      .get('cbjs_cluster_config', { timeout: 200, throwIfMissing: false });

    currentConfig = result?.content || {};
  }

  const changes = getCouchbaseClusterChanges(currentConfig, clusterConfig);

  if (changes.length > 0) {
    console.log(
      `The following changes have been detected in the cluster : \n\t${changes.map((c) => JSON.stringify(c)).join('\n\t')}`
    );

    await applyCouchbaseClusterChanges(cluster, apiConfig, changes, {
      timeout: 180_000,
    });

    await cluster
      .bucket('conduit')
      .defaultCollection()
      .upsert('cbjs_cluster_config', clusterConfig);
  }
}
