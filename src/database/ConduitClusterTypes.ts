import { ClusterScope, DocDef } from '@cbjsdev/cbjs';

import { ArticleDocument } from 'src/database/schemas/article.js';
import { CommentDocument } from 'src/database/schemas/comment.js';
import { ArticleId, CommentId, UserId } from 'src/database/schemas/ids.js';
import { UserDocument } from 'src/database/schemas/user.js';

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
