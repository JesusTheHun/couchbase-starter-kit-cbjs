import { beforeEach, describe, expect, it } from 'vitest';

import { getRandomId } from 'src/utils/getRandom.js';
import {
  AuthenticatedTestContext,
  createAuthenticatedTestContext,
} from 'tests/utils/createAuthenticatedTestContext.js';
import { waitForAllComments } from 'tests/utils/waitForAllComments.js';

describe('getComments', () => {
  beforeEach(createAuthenticatedTestContext);
  beforeEach<AuthenticatedTestContext>(async ({ cb }) => {
    await cb.query('DELETE FROM articles WHERE authorId IS NOT MISSING');
    await cb.query('DELETE FROM comments WHERE articleId IS NOT MISSING');
  });

  it<AuthenticatedTestContext>('should get the comments of the article', async ({
    trpcCaller,
    cb,
    userId,
  }) => {
    const articleTitle = getRandomId();
    const articleTitle2 = getRandomId();

    const { article } = await trpcCaller.articles.createArticle({
      article: {
        title: articleTitle,
        description: 'Discover why Cbjs is so good. The 4th reason will blow your mind!',
        body: 'Yada yada, the best, whatever',
        tagList: ['couchbase', 'node', 'typescript'],
      },
    });

    const { article: article2 } = await trpcCaller.articles.createArticle({
      article: {
        title: articleTitle2,
        description: 'Discover why Cbjs is so good. The 4th reason will blow your mind!',
        body: 'Yada yada, the best, whatever',
        tagList: ['couchbase', 'node', 'typescript'],
      },
    });

    await trpcCaller.articles.addComment({
      slug: article.slug,
      comment: {
        body: "It's me, Mario !",
      },
    });

    await trpcCaller.articles.addComment({
      slug: article2.slug,
      comment: {
        body: "It's me, Luigi !",
      },
    });

    await waitForAllComments(cb);
    
    const { comments } = await trpcCaller.articles.getComments({
      slug: article.slug,
    });

    expect(comments).toHaveLength(1);
    expect(comments).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        body: "It's me, Mario !",
        authorId: userId,
        articleId: `article__${article.slug}`,
      }),
    ]);
  });
});
