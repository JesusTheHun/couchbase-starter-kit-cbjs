import { arkCommentDocument, CommentDocument } from 'src/database/schemas/comment.js';
import { arkCommentId, ArticleId, CommentId } from 'src/database/schemas/ids.js';
import { ForbiddenError } from 'src/errors/ForbiddenError.js';
import { getRequestContext } from 'src/trpc/requestALS.js';
import { getRandomId } from 'src/utils/getRandom.js';

export async function deleteComment(commentId: CommentId) {
  const { userId, cb } = getRequestContext();

  const {
    content: [{ value: authorId }],
  } = await cb.collection('comments').lookupIn(commentId).get('authorId');

  if (userId != authorId) {
    throw new ForbiddenError();
  }

  await cb.collection('comments').remove(commentId);
}
