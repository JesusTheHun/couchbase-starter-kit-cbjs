import { ArticleId } from 'src/database/models/ids.js';
import { extractUsername } from 'src/domains/authentication/utils/extractUsername.js';
import { getUserProfile } from 'src/domains/profiles/business/getUserProfile.js';
import { getUnauthenticatedRequestContext } from 'src/trpc/requestALS.js';

export async function getArticle(articleId: ArticleId) {
  const { userId, cb } = getUnauthenticatedRequestContext();

  const { content: article } = await cb.collection('articles').get(articleId);
  const author = await getUserProfile(extractUsername(article.authorId));

  let isFavorite = false;

  if (userId) {
    const {
      content: [{ value: favorite }],
    } = await cb.collection('users').lookupIn(userId).exists(`favorites.${articleId}`);

    isFavorite = !!favorite;
  }

  return {
    ...article,
    favorited: isFavorite,
    author,
  };
}
