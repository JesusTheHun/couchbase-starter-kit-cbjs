import { arkApiArticleCriteria } from 'src/domains/articles/schemas.js';
import { publicProcedure, router } from 'src/trpc/trpc.js';

export const articlesRouter = router({
  getLatestArticles: publicProcedure
    .input(arkApiArticleCriteria)
    .query(async ({ input }) => {
      // TODO
    }),
});
