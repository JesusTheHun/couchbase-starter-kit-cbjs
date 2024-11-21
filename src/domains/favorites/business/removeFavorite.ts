import { ArticleId } from 'src/database/models/ids.js';
import { getRequestContext } from 'src/trpc/requestALS.js';

export async function removeFavorite(articleId: ArticleId) {
  const { cb, userId } = getRequestContext();

  await cb.collection('users').mutateIn(userId).remove(`favorites.${articleId}`);

  // We accept that in the event of a crash, we may have an inconsistency in favorites count.
  await cb.collection('articles').mutateIn(articleId).decrement('favoritesCount', 1);
}
