import { type } from 'arktype';

import { arkCommentDocument } from 'src/database/schemas/comment.js';
import { arkCommentId } from 'src/database/schemas/ids.js';
import { arkApiUserProfileOutput } from 'src/domains/profiles/schemas.js';

export const arkApiCommentOutput = type({
  comment: arkCommentDocument.pick('body', 'updatedAt', 'createdAt').merge({
    id: arkCommentId,
    author: arkApiUserProfileOutput.get('profile'),
  }),
});
