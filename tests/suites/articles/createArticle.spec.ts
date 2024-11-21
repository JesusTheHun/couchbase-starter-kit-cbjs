import { beforeEach, describe, expect, it } from 'vitest';

import { getRandomId } from 'src/utils/getRandom.js';
import {
  AuthenticatedTestContext,
  createAuthenticatedTestContext,
} from 'tests/utils/createAuthenticatedTestContext.js';

describe('create article', () => {
  beforeEach(createAuthenticatedTestContext);

  it<AuthenticatedTestContext>('should create an article', async ({
    trpcCaller,
    user,
  }) => {
    const randomSuffix = getRandomId();
    const result = await trpcCaller.articles.createArticle({
      article: {
        title: `cbjs rules ${randomSuffix}`,
        description: 'Discover why Cbjs is so good. The 4th reason will blow your mind!',
        body: 'Yada yada, the best, whatever',
        tagList: ['couchbase', 'node', 'typescript'],
      },
    });

    expect(result).toEqual({
      article: {
        title: `cbjs rules ${randomSuffix}`,
        slug: `cbjs-rules-${randomSuffix}`,
        description: 'Discover why Cbjs is so good. The 4th reason will blow your mind!',
        body: 'Yada yada, the best, whatever',
        tagList: ['couchbase', 'node', 'typescript'],
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        favorited: false,
        favoritesCount: 0,
        author: {
          username: user.username,
          bio: user.bio,
          image: user.image,
          following: false,
        },
      },
    });
  });
});
