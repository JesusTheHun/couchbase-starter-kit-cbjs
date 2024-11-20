import { CouchbaseClusterConfig } from '@cbjsdev/deploy';

export const clusterConfig: CouchbaseClusterConfig = {
  users: [
    {
      username: 'api',
      password: 'password',
      roles: [
        {
          name: 'query_update',
          bucket: 'conduit',
          scope: '*',
          collection: '*',
        },
        {
          name: 'query_select',
          bucket: 'conduit',
          scope: '*',
          collection: '*',
        },
        {
          name: 'query_insert',
          bucket: 'conduit',
          scope: '*',
          collection: '*',
        },
        {
          name: 'query_delete',
          bucket: 'conduit',
          scope: '*',
          collection: '*',
        },
        {
          name: 'fts_searcher',
          bucket: 'conduit',
          scope: '*',
          collection: '*',
        },
        {
          name: 'data_writer',
          bucket: 'conduit',
          scope: '*',
          collection: '*',
        },
        {
          name: 'data_reader',
          bucket: 'conduit',
          scope: '*',
          collection: '*',
        },
      ],
    },
  ],
  keyspaces: {
    conduit: {
      ramQuotaMB: 100,
      numReplicas: 0,
      scopes: {
        blog: {
          collections: {
            users: {
              indexes: {
                user_email: {
                  keys: ['email'],
                },
              },
            },
            articles: {},
          },
        },
      },
    },
  },
};
