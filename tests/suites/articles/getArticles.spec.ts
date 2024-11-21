import { beforeEach, describe, expect, it } from 'vitest';
import { setTimeout } from 'node:timers/promises';

import { getRandomEmail, getRandomId, getRandomUsername } from 'src/utils/getRandom.js';
import {
  AuthenticatedTestContext,
  createAuthenticatedTestContext,
} from 'tests/utils/createAuthenticatedTestContext.js';
import { waitForAllArticles } from 'tests/utils/waitForAllArticles.js';

describe('getArticles', () => {
  beforeEach(createAuthenticatedTestContext);
  beforeEach<AuthenticatedTestContext>(async ({ cb }) => {
    await cb.query('DELETE FROM articles WHERE authorId IS NOT MISSING');
  });

  it<AuthenticatedTestContext>('should return an empty list when there is no article', async ({
    trpcCaller,
    cb,
    userId,
  }) => {
    const result = await trpcCaller.articles.getArticles({});

    expect(result).toEqual({ articles: [] });
  });

  it<AuthenticatedTestContext>('should return the list order by creation date desc', async ({
    trpcCaller,
    cb,
    userId,
  }) => {
    const articleTitle = getRandomId();
    const articleTitle2 = getRandomId();
    await trpcCaller.articles.createArticle({
      article: {
        title: articleTitle,
        description: 'Discover why Cbjs is so good. The 4th reason will blow your mind!',
        body: 'Yada yada, the best, whatever',
        tagList: ['couchbase', 'node', 'typescript'],
      },
    });

    await setTimeout(100);

    await trpcCaller.articles.createArticle({
      article: {
        title: articleTitle2,
        description: 'Discover why Cbjs is so good. The 4th reason will blow your mind!',
        body: 'Yada yada, the best, whatever',
        tagList: ['couchbase', 'node', 'typescript'],
      },
    });

    await waitForAllArticles(cb);

    const result = await trpcCaller.articles.getArticles({});

    expect(result.articles).toHaveLength(2);

    expect(result.articles[0]?.title).toEqual(articleTitle2);
    expect(result.articles[1]?.title).toEqual(articleTitle);

    // We make sure we don't leak sensitive data
    expect(result.articles[0]?.author).not.toHaveProperty('password');
    expect(result.articles[0]?.author).not.toHaveProperty('token');
  });

  it<AuthenticatedTestContext>('should return the list with the given author', async ({
    requestContext,
    trpcCaller,
    cb,
    user,
  }) => {
    const { user: user2 } = await trpcCaller.auth.register({
      user: {
        email: getRandomEmail(),
        username: getRandomUsername(),
        password: 'password',
      },
    });

    await trpcCaller.articles.createArticle({
      article: {
        title: 'first',
        description: 'Discover why Cbjs is so good. The 4th reason will blow your mind!',
        body: 'Yada yada, the best, whatever',
        tagList: ['couchbase', 'node', 'typescript'],
      },
    });

    // We create the article with another user
    requestContext.userId = `user__${user2.username}`;

    await trpcCaller.articles.createArticle({
      article: {
        title: 'second',
        description: 'Discover why Cbjs is so good. The 4th reason will blow your mind!',
        body: 'Yada yada, the best, whatever',
        tagList: ['couchbase', 'node', 'typescript'],
      },
    });

    await waitForAllArticles(cb);

    const result = await trpcCaller.articles.getArticles({
      author: user2.username,
    });

    expect(result.articles).toHaveLength(1);
    expect(result.articles[0]?.author.username).toEqual(user2.username);
  });

  it<AuthenticatedTestContext>('should return the list with the given tag', async ({
    requestContext,
    trpcCaller,
    cb,
    user,
  }) => {
    await trpcCaller.articles.createArticle({
      article: {
        title: 'first',
        description: 'Discover why Cbjs is so good. The 4th reason will blow your mind!',
        body: 'Yada yada, the best, whatever',
        tagList: ['couchbase'],
      },
    });

    await trpcCaller.articles.createArticle({
      article: {
        title: 'second',
        description: 'Discover why Cbjs is so good. The 4th reason will blow your mind!',
        body: 'Yada yada, the best, whatever',
        tagList: ['typescript'],
      },
    });

    await waitForAllArticles(cb);

    const result = await trpcCaller.articles.getArticles({
      tag: 'couchbase',
    });

    expect(result.articles).toHaveLength(1);
    expect(result.articles[0]?.title).toEqual('first');
  });

  it<AuthenticatedTestContext>('should return the list of articles favorited by the given user', async ({
    trpcCaller,
    cb,
    userId,
  }) => {
    const { article } = await trpcCaller.articles.createArticle({
      article: {
        title: 'first',
        description: 'Discover why Cbjs is so good. The 4th reason will blow your mind!',
        body: 'Yada yada, the best, whatever',
        tagList: ['couchbase'],
      },
    });

    await trpcCaller.articles.createArticle({
      article: {
        title: 'second',
        description: 'Discover why Cbjs is so good. The 4th reason will blow your mind!',
        body: 'Yada yada, the best, whatever',
        tagList: ['typescript'],
      },
    });

    await trpcCaller.articles.addFavorite({ slug: article.slug });

    await waitForAllArticles(cb);

    const result = await trpcCaller.articles.getArticles({
      favorited: userId,
    });

    expect(result.articles).toHaveLength(1);
    expect(result.articles[0]?.title).toEqual('first');
  });
});
