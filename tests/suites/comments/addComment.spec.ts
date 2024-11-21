import { beforeEach, describe, expect, it } from 'vitest';

import { getRandomId } from 'src/utils/getRandom.js';
import {
  AuthenticatedTestContext,
  createAuthenticatedTestContext,
} from 'tests/utils/createAuthenticatedTestContext.js';

describe('addComment', () => {
  beforeEach(createAuthenticatedTestContext);
  beforeEach<AuthenticatedTestContext>(async ({ cb }) => {
    await cb.query('DELETE FROM articles WHERE authorId IS NOT MISSING');
    await cb.query('DELETE FROM comments WHERE articleId IS NOT MISSING');
  });

  it<AuthenticatedTestContext>('should add a comment to the article', async ({
    trpcCaller,
    cb,
    userId,
  }) => {
    const articleTitle = getRandomId();
    const { article } = await trpcCaller.articles.createArticle({
      article: {
        title: articleTitle,
        description: 'Discover why Cbjs is so good. The 4th reason will blow your mind!',
        body: 'Yada yada, the best, whatever',
        tagList: ['couchbase', 'node', 'typescript'],
      },
    });

    const { comment } = await trpcCaller.articles.addComment({
      slug: article.slug,
      comment: {
        body: "It's me, Mario !",
      },
    });

    expect(comment).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        body: "It's me, Mario !",
        authorId: userId,
        articleId: `article__${article.slug}`,
      })
    );
  });

  it<AuthenticatedTestContext>('should throw an error when adding a comment to a missing article', async ({
    trpcCaller,
    cb,
    userId,
  }) => {
    await expect(
      trpcCaller.articles.addComment({
        slug: 'meh',
        comment: {
          body: "It's me, Mario !",
        },
      })
    ).rejects.toThrowTRPCError();
  });
});
