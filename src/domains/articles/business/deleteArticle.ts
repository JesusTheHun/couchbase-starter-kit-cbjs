import { ArticleId } from 'src/database/models/ids.js';
import { ForbiddenError } from 'src/errors/ForbiddenError.js';
import { getRequestContext } from 'src/trpc/requestALS.js';

export async function deleteArticle(articleId: ArticleId): Promise<void> {
  const { userId, cb } = getRequestContext();

  const {
    content: [{ value: authorId }],
  } = await cb.collection('articles').lookupIn(articleId).get('authorId');

  if (userId != authorId) {
    throw new ForbiddenError();
  }

  await cb.collection('articles').remove(articleId);
}
