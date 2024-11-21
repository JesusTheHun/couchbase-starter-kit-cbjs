import { CouchbaseClusterConfig } from '@cbjsdev/deploy';

export const clusterConfig: CouchbaseClusterConfig = {
  keyspaces: {
    conduit: {
      ramQuotaMB: 100,
      numReplicas: 0,
      scopes: {
        blog: {
          collections: {
            users: {
              indexes: {
                email: {
                  keys: ['email'],
                },
              },
            },
            articles: {
              indexes: {
                authorId: {
                  keys: ['authorId'],
                },
                tags: {
                  keys: ['ALL `tagList`'],
                },
              },
            },
            comments: {
              indexes: {
                get_comments: {
                  keys: ['articleId', 'createdAt'],
                },
              },
            },
          },
        },
      },
    },
  },
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
};
