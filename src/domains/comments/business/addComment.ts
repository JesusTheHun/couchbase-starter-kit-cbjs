import { arkCommentDocument, CommentDocument } from 'src/database/models/comments.js';
import { arkCommentId, ArticleId } from 'src/database/models/ids.js';
import { getRequestContext } from 'src/trpc/requestALS.js';
import { getRandomId } from 'src/utils/getRandom.js';

export async function addComment(articleId: ArticleId, body: string) {
  const { cb, userId } = getRequestContext();

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
