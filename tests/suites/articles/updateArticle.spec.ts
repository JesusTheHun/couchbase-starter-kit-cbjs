import { beforeEach, describe, expect, it } from 'vitest';

import { getRandomId } from 'src/utils/getRandom.js';
import {
  AuthenticatedTestContext,
  createAuthenticatedTestContext,
} from 'tests/utils/createAuthenticatedTestContext.js';

describe('update article', () => {
  beforeEach(createAuthenticatedTestContext);

  it<AuthenticatedTestContext>('should update an article', async ({
    trpcCaller,
    user,
  }) => {
    const randomSuffix = getRandomId();
    const { article } = await trpcCaller.articles.createArticle({
      article: {
        title: `cbjs rules ${randomSuffix}`,
        description: 'Discover why Cbjs is so good. The 4th reason will blow your mind!',
        body: 'Yada yada, the best, whatever',
        tagList: ['couchbase', 'node', 'typescript'],
      },
    });

    const result = await trpcCaller.articles.updateArticle({
      slug: article.slug,
      article: {
        body: 'article updated!',
      },
    });

    expect(result.article.body).toEqual('article updated!');
  });

  it<AuthenticatedTestContext>('should change the title of an article', async ({
    trpcCaller,
    cb,
  }) => {
    const randomSuffix = getRandomId();
    const { article } = await trpcCaller.articles.createArticle({
      article: {
        title: `cbjs rules ${randomSuffix}`,
        description: 'Discover why Cbjs is so good. The 4th reason will blow your mind!',
        body: 'Yada yada, the best, whatever',
        tagList: ['couchbase', 'node', 'typescript'],
      },
    });

    const result = await trpcCaller.articles.updateArticle({
      slug: article.slug,
      article: {
        title: `new rules ${randomSuffix}`,
      },
    });

    expect(result.article.title).toEqual(`new rules ${randomSuffix}`);

    // We check the former document has been deleted
    const { exists } = await cb.collection('articles').exists(`article__${article.slug}`);

    expect(exists).toBe(false);

    // We check the new document does not have `replacedBy`
    const { content } = await cb
      .collection('articles')
      .get(`article__${result.article.slug}`);

    expect(content.replacedBy).toBeUndefined();
  });

  it<AuthenticatedTestContext>('should throw a FORBIDDEN exception when updating an article of someone else', async ({
    trpcCaller,
    requestContext,
  }) => {
    const randomSuffix = getRandomId();
    const { article } = await trpcCaller.articles.createArticle({
      article: {
        title: `cbjs rules ${randomSuffix}`,
        description: 'Discover why Cbjs is so good. The 4th reason will blow your mind!',
        body: 'Yada yada, the best, whatever',
        tagList: ['couchbase', 'node', 'typescript'],
      },
    });

    requestContext.userId = 'user__meh';

    await expect(
      trpcCaller.articles.updateArticle({
        slug: article.slug,
        article: {
          body: 'article updated!',
        },
      })
    ).rejects.toThrowTRPCError('FORBIDDEN');
  });
});
