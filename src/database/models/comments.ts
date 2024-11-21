import { type } from 'arktype';

import { arkArticleId, arkUserId } from 'src/database/models/ids.js';

export const arkCommentDocument = type({
  createdAt: 'number.epoch',
  updatedAt: 'number.epoch',
  body: 'string >= 10',
  articleId: arkArticleId,
  authorId: arkUserId,
});

export type CommentDocument = typeof arkCommentDocument.infer;
