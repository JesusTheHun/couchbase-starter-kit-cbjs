import { type } from 'arktype';

/**
 * We create a file dedicated to document ids to avoid importing
 * all the schemas of a file when we only need an id, which is very common.
 * This also helps to prevent a circular dependencies.
 */

export const arkUserId = type.string.satisfying((v, ctx): v is UserId => {
  if (v.startsWith('user__')) {
    return true;
  }

  return ctx.mustBe('a user id.');
});

export const arkArticleId = type.string.satisfying((v, ctx): v is ArticleId => {
  if (v.startsWith('article__') && v.length < 240) {
    return true;
  }

  return ctx.mustBe('an article id.');
});

export const arkCommentId = type.string.satisfying((v, ctx): v is CommentId => {
  if (v.startsWith('comment__')) {
    return true;
  }

  return ctx.mustBe('an comment id.');
});

/**
 * Format: user__<username>
 */
export type UserId = `user__${string}`;

/**
 * Format: article__<articleSlug>
 */
export type ArticleId = `article__${string}`;

/**
 * Format: comment__<randomString>
 */
export type CommentId = `comment__${string}`;
