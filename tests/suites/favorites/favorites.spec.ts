import { beforeEach, describe, expect, it } from 'vitest';

import {
  AuthenticatedTestContext,
  createAuthenticatedTestContext,
} from 'tests/utils/createAuthenticatedTestContext.js';

describe('favorites', () => {
  beforeEach(createAuthenticatedTestContext);
  beforeEach<AuthenticatedTestContext>(async ({ cb }) => {
    await cb.query('DELETE FROM articles WHERE authorId IS NOT MISSING');
  });
  beforeEach<AuthenticatedTestContext>(async ({ trpcCaller }) => {
    await trpcCaller.articles.createArticle({
      article: {
        title: 'first',
        description: 'Discover why Cbjs is so good. The 4th reason will blow your mind!',
        body: 'Yada yada, the best, whatever',
      },
    });
  });

  it<AuthenticatedTestContext>('should add the article to the favorites', async ({
    trpcCaller,
    cb,
    userId,
  }) => {
    await trpcCaller.articles.addFavorite({ slug: 'first' });

    const result = await trpcCaller.articles.getArticle({ slug: 'first' });

    expect(result.article.favorited).toBe(true);
    expect(result.article.favoritesCount).toBe(1);
  });

  it<AuthenticatedTestContext>('should throw an error when adding an article to the favorites twice', async ({
    trpcCaller,
    cb,
    userId,
  }) => {
    await trpcCaller.articles.addFavorite({ slug: 'first' });
    await expect(
      trpcCaller.articles.addFavorite({ slug: 'first' })
    ).rejects.toThrowTRPCError();

    const result = await trpcCaller.articles.getArticle({ slug: 'first' });

    expect(result.article.favorited).toBe(true);
    expect(result.article.favoritesCount).toBe(1);
  });

  it<AuthenticatedTestContext>('should remove the article from the favorites', async ({
    trpcCaller,
    cb,
    userId,
  }) => {
    await trpcCaller.articles.addFavorite({ slug: 'first' });
    await trpcCaller.articles.removeFavorite({ slug: 'first' });

    const result = await trpcCaller.articles.getArticle({ slug: 'first' });

    expect(result.article.favorited).toBe(false);
    // expect(result.article.favoritesCount).toBe(0); TODO uncomment once the fix is released
  });

  it<AuthenticatedTestContext>('should throw an error when removing a favorite that isnt one', async ({
    trpcCaller,
    cb,
    userId,
  }) => {
    await expect(
      trpcCaller.articles.removeFavorite({ slug: 'first' })
    ).rejects.toThrowTRPCError();

    const result = await trpcCaller.articles.getArticle({ slug: 'first' });

    expect(result.article.favorited).toBe(false);
    expect(result.article.favoritesCount).toBe(0);
  });
});
