import { arkCommentDocument } from 'src/database/models/comments.js';
import { arkCommentId } from 'src/database/models/ids.js';
import { arkApiUserProfileOutput } from 'src/domains/profiles/schemas.js';

export const arkApiCommentOutput = arkCommentDocument
  .pick('body', 'updatedAt', 'createdAt')
  .merge({
    id: arkCommentId,
    author: arkApiUserProfileOutput.get('profile'),
  });
