import { ClusterScope, DocDef } from '@cbjsdev/cbjs';

import { UserId } from 'src/database/models/ids.js';
import { UserDocument } from 'src/database/models/user.js';

export type ConduitClusterTypes = {
  '@options': {
    keyMatchingStrategy: 'delimiter';
    keyDelimiter: '__';
  };
  'conduit': {
    blog: {
      users: [DocDef<UserId, UserDocument>];
    };
  };
};

export type ConduitScopeBlog = ClusterScope<ConduitClusterTypes, 'conduit', 'blog'>;
