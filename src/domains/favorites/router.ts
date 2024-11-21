import { type } from 'arktype';

import { arkArticleId } from 'src/database/schemas/ids.js';
import { getArticle } from 'src/domains/articles/business/getArticle.js';
import { addFavorite } from 'src/domains/favorites/business/addFavorite.js';
import { removeFavorite } from 'src/domains/favorites/business/removeFavorite.js';
import { authenticatedProcedure, router } from 'src/trpc/trpc.js';

export const favoritesRouter = router({
  addFavorite: authenticatedProcedure
    .input(type({ slug: 'string' }))
    .mutation(async ({ input }) => {
      const articleId = arkArticleId.assert(`article__${input.slug}`);
      await addFavorite(articleId);

      return await getArticle(articleId);
    }),
  removeFavorite: authenticatedProcedure
    .input(type({ slug: 'string' }))
    .mutation(async ({ input }) => {
      const articleId = arkArticleId.assert(`article__${input.slug}`);
      await removeFavorite(articleId);

      return await getArticle(articleId);
    }),
});
