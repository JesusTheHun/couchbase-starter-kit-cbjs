import { beforeEach, describe, expect, it, RunnerTestCase } from 'vitest';

import { ApiGetArticleOutput } from 'src/domains/articles/schemas.js';
import {
  AuthenticatedTestContext,
  createAuthenticatedTestContext,
} from 'tests/utils/createAuthenticatedTestContext.js';

describe('favorites', () => {
  type LocalTestContext = AuthenticatedTestContext & {
    article: ApiGetArticleOutput['article'];
    task: RunnerTestCase<LocalTestContext>;
  };

  beforeEach(createAuthenticatedTestContext);
  beforeEach<AuthenticatedTestContext>(async ({ cb }) => {
    await cb.query('DELETE FROM articles WHERE authorId IS NOT MISSING');
  });
  beforeEach<LocalTestContext>(async ({ task, trpcCaller }) => {
    const { article } = await trpcCaller.articles.createArticle({
      article: {
        title: 'first',
        description: 'Discover why Cbjs is so good. The 4th reason will blow your mind!',
        body: 'Yada yada, the best, whatever',
      },
    });

    task.context.article = article;
  });

  it<LocalTestContext>('should add the article to the favorites', async ({
    trpcCaller,
    article,
  }) => {
    await trpcCaller.articles.addFavorite({ slug: article.slug });

    const result = await trpcCaller.articles.getArticle({ slug: article.slug });

    expect(result.article.favorited).toBe(true);
    expect(result.article.favoritesCount).toBe(1);
  });

  it<LocalTestContext>('should throw an error when adding an article to the favorites twice', async ({
    trpcCaller,
    article,
  }) => {
    await trpcCaller.articles.addFavorite({ slug: article.slug });
    await expect(
      trpcCaller.articles.addFavorite({ slug: article.slug })
    ).rejects.toThrowTRPCError();

    const result = await trpcCaller.articles.getArticle({ slug: article.slug });

    expect(result.article.favorited).toBe(true);
    expect(result.article.favoritesCount).toBe(1);
  });

  it<LocalTestContext>('should remove the article from the favorites', async ({
    trpcCaller,
    article,
  }) => {
    await trpcCaller.articles.addFavorite({ slug: article.slug });
    await trpcCaller.articles.removeFavorite({ slug: article.slug });

    const result = await trpcCaller.articles.getArticle({ slug: article.slug });

    expect(result.article.favorited).toBe(false);
    expect(result.article.favoritesCount).toBe(0);
  });

  it<LocalTestContext>('should throw an error when removing a favorite that isnt one', async ({
    trpcCaller,
    article,
  }) => {
    await expect(
      trpcCaller.articles.removeFavorite({ slug: article.slug })
    ).rejects.toThrowTRPCError();

    const result = await trpcCaller.articles.getArticle({ slug: article.slug });

    expect(result.article.favorited).toBe(false);
    expect(result.article.favoritesCount).toBe(0);
  });
});
