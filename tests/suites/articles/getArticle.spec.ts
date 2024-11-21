import { beforeEach, describe, expect, it } from 'vitest';

import {
  AuthenticatedTestContext,
  createAuthenticatedTestContext,
} from 'tests/utils/createAuthenticatedTestContext.js';
import { waitForAllArticles } from 'tests/utils/waitForAllArticles.js';

describe('getArticle', () => {
  beforeEach(createAuthenticatedTestContext);
  beforeEach<AuthenticatedTestContext>(async ({ cb }) => {
    await cb.query('DELETE FROM articles WHERE authorId IS NOT MISSING');
  });

  it<AuthenticatedTestContext>('should throw an error when getting a missing article', async ({
    trpcCaller,
    cb,
    userId,
  }) => {
    await expect(
      trpcCaller.articles.getArticle({ slug: 'missing' })
    ).rejects.toThrowTRPCError();
  });

  it<AuthenticatedTestContext>('should return the article', async ({
    trpcCaller,
    cb,
    userId,
  }) => {
    const { article } = await trpcCaller.articles.createArticle({
      article: {
        title: 'first',
        description: 'Discover why Cbjs is so good. The 4th reason will blow your mind!',
        body: 'Yada yada, the best, whatever',
        tagList: ['couchbase', 'node', 'typescript'],
      },
    });

    await waitForAllArticles(cb);

    const result = await trpcCaller.articles.getArticle({ slug: article.slug });

    expect(result.article).toEqual(
      expect.objectContaining({
        title: 'first',
      })
    );
  });
});
