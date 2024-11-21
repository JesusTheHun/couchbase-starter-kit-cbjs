import { arkCommentDocument, CommentDocument } from 'src/database/schemas/comment.js';
import { arkCommentId, ArticleId } from 'src/database/schemas/ids.js';
import { NotFoundError } from 'src/errors/NotFoundError.js';
import { getRequestContext } from 'src/trpc/requestALS.js';
import { getRandomId } from 'src/utils/getRandom.js';

export async function addComment(articleId: ArticleId, body: string) {
  const { cb, userId } = getRequestContext();

  const { exists } = await cb.collection('articles').exists(articleId);

  if (!exists) {
    throw new NotFoundError('Article not found.');
  }

  const comment = {
    articleId,
    authorId: userId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    body,
  } satisfies CommentDocument;

  const commentId = arkCommentId.assert(`comment__${getRandomId()}`);

  await cb.collection('comments').insert(commentId, arkCommentDocument.assert(comment));

  return {
    id: commentId,
    ...comment,
  };
}
