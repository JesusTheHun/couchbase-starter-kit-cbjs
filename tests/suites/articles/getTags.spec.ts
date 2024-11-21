import { beforeEach, describe, expect, it } from 'vitest';

import {
  AuthenticatedTestContext,
  createAuthenticatedTestContext,
} from 'tests/utils/createAuthenticatedTestContext.js';
import { waitForAllArticles } from 'tests/utils/waitForAllArticles.js';

describe('getTags', () => {
  beforeEach(createAuthenticatedTestContext);
  beforeEach<AuthenticatedTestContext>(async ({ cb }) => {
    await cb.query('DELETE FROM articles WHERE authorId IS NOT MISSING');
  });

  it<AuthenticatedTestContext>('should return all existing tags', async ({
    trpcCaller,
    cb,
    userId,
  }) => {
    await trpcCaller.articles.createArticle({
      article: {
        title: 'first',
        description: 'Discover why Cbjs is so good. The 4th reason will blow your mind!',
        body: 'Yada yada, the best, whatever',
        tagList: ['foo'],
      },
    });

    await trpcCaller.articles.createArticle({
      article: {
        title: 'first',
        description: 'Discover why Cbjs is so good. The 4th reason will blow your mind!',
        body: 'Yada yada, the best, whatever',
        tagList: ['bar'],
      },
    });

    await waitForAllArticles(cb);

    const { tags } = await trpcCaller.articles.getTags();

    expect(tags).toHaveLength(2);
    expect(tags).toContain('foo');
    expect(tags).toContain('bar');
  });
});
