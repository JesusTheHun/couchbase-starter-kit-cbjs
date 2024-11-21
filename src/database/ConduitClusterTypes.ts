import { ClusterScope, DocDef } from '@cbjsdev/cbjs';

import { ArticleDocument } from 'src/database/models/article.js';
import { ArticleId, CommentId, UserId } from 'src/database/models/ids.js';
import { UserDocument } from 'src/database/models/user.js';
import { CommentDocument } from './models/comments.js';

export type ConduitClusterTypes = {
  '@options': {
    keyMatchingStrategy: 'delimiter';
    keyDelimiter: '__';
  };
  'conduit': {
    blog: {
      users: [DocDef<UserId, UserDocument>];
      articles: [DocDef<ArticleId, ArticleDocument>];
      comments: [DocDef<CommentId, CommentDocument>];
    };
  };
};

export type ConduitScopeBlog = ClusterScope<ConduitClusterTypes, 'conduit', 'blog'>;
