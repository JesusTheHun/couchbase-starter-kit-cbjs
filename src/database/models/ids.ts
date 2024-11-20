import { type } from 'arktype';

export const arkUserId = type.string.satisfying((v, ctx): v is UserId => {
  if (v.startsWith('user__')) {
    return true;
  }

  return ctx.mustBe('a user document key.');
});

/**
 * Format: user__<username>
 */
export type UserId = `user__${string}`;
