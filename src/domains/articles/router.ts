import { type } from 'arktype';

import { arkArticleId, ArticleId } from 'src/database/models/ids.js';
import { createArticle } from 'src/domains/articles/business/createArticle.js';
import { deleteArticle } from 'src/domains/articles/business/deleteArticle.js';
import { getArticle } from 'src/domains/articles/business/getArticle.js';
import { getArticles } from 'src/domains/articles/business/getArticles.js';
import { updateArticle } from 'src/domains/articles/business/updateArticle.js';
import {
  arkApiArticleCreateInput,
  arkApiArticleCriteria,
  arkApiArticleUpdateInput,
  arkApiGetArticleOutput,
  arkApiGetArticlesOutput,
} from 'src/domains/articles/schemas.js';
import { extractUsername } from 'src/domains/authentication/utils/extractUsername.js';
import { getUserProfile } from 'src/domains/profiles/business/getUserProfile.js';
import { authenticatedProcedure, publicProcedure, router } from 'src/trpc/trpc.js';

export const articlesRouter = router({
  createArticle: authenticatedProcedure
    .input(arkApiArticleCreateInput.assert)
    .output(arkApiGetArticleOutput.assert)
    .mutation(async ({ input, ctx }) => {
      const article = await createArticle(input.article);
      const author = await getUserProfile(extractUsername(ctx.userId));

      return {
        article: {
          ...article,
          favorited: false,
          author,
        },
      } as never;
    }),

  updateArticle: authenticatedProcedure
    .input(arkApiArticleUpdateInput.assert)
    .output(arkApiGetArticleOutput.assert)
    .mutation(async ({ input, ctx }) => {
      const articleId = arkArticleId.assert(`article__${input.slug}`);
      const newArticleId = await updateArticle(articleId, input.article);
      const article = await getArticle(newArticleId);
      const author = await getUserProfile(extractUsername(ctx.userId));

      return {
        article: {
          ...article,
          favorited: false,
          author,
        },
      } as never;
    }),

  deleteArticle: authenticatedProcedure
    .input(type({ slug: 'string' }).assert)
    .mutation(async ({ input }) => {
      const articleId = arkArticleId.assert(`article__${input.slug}`);
      return await deleteArticle(articleId);
    }),

  getArticle: publicProcedure
    .input(type({ slug: 'string' }).assert)
    .output(arkApiGetArticleOutput.assert)
    .query(async ({ input }) => {
      const articleId = arkArticleId.assert(`article__${input.slug}`);
      const article = await getArticle(articleId);

      return { article } as never;
    }),

  getArticles: publicProcedure
    .input(arkApiArticleCriteria.assert)
    .output(arkApiGetArticlesOutput.assert)
    .query(async ({ input }) => {
      const articles = await getArticles(input);

      return {
        articles,
      };
    }),
});
