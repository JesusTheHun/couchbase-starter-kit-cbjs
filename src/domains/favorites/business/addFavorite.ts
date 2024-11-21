import { ArticleId } from 'src/database/schemas/ids.js';
import { getRequestContext } from 'src/trpc/requestALS.js';

export async function addFavorite(articleId: ArticleId) {
  const { cb, userId } = getRequestContext();

  await cb
    .collection('users')
    .mutateIn(userId)
    .insert(`favorites.${articleId}`, { since: Date.now() });

  // We accept that in the event of a crash, we may have an inconsistency in favorites count.
  await cb.collection('articles').mutateIn(articleId).increment('favoritesCount', 1);
}
