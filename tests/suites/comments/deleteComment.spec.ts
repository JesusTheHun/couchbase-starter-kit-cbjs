import { beforeEach, describe, expect, it } from 'vitest';

import { getRandomId } from 'src/utils/getRandom.js';
import {
  AuthenticatedTestContext,
  createAuthenticatedTestContext,
} from 'tests/utils/createAuthenticatedTestContext.js';

describe('deleteComment', () => {
  beforeEach(createAuthenticatedTestContext);
  beforeEach<AuthenticatedTestContext>(async ({ cb }) => {
    await cb.query('DELETE FROM articles WHERE authorId IS NOT MISSING');
    await cb.query('DELETE FROM comments WHERE articleId IS NOT MISSING');
  });

  it<AuthenticatedTestContext>('should delete a comment from the article', async ({
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

    await trpcCaller.articles.deleteComment({
      commentId: comment.id,
    });
  });

  it<AuthenticatedTestContext>('should throw an error when deleting a comment authored by somebody else', async ({
    trpcCaller,
    requestContext,
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

    requestContext.userId = 'user__somebodyElse';

    await expect(
      trpcCaller.articles.deleteComment({
        commentId: comment.id,
      })
    ).rejects.toThrowTRPCError();
  });
});
