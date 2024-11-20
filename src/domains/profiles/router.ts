import { type } from 'arktype';

import { arkApiUserAuthenticationOutput } from 'src/domains/authentication/schemas.js';
import { followUser } from 'src/domains/profiles/business/followUser.js';
import { getUserProfile } from 'src/domains/profiles/business/getUserProfile.js';
import { unfollowUser } from 'src/domains/profiles/business/unfollowUser.js';
import { arkApiUserProfileOutput } from 'src/domains/profiles/schemas.js';
import { getUnauthenticatedRequestContext } from 'src/trpc/requestALS.js';
import { authenticatedProcedure, publicProcedure, router } from 'src/trpc/trpc.js';
import { invariant } from 'src/utils/type-guards.js';

export const profilesRouter = router({
  me: authenticatedProcedure
    .output(arkApiUserAuthenticationOutput.assert)
    .query(async ({ ctx }) => {
      const { cb } = getUnauthenticatedRequestContext();
      const { content: user } = await cb.collection('users').get(ctx.userId);

      const { email, username, token, bio, image } = user;
      invariant(token);

      return {
        user: {
          email,
          username,
          token,
          bio,
          image,
        },
      };
    }),

  get: publicProcedure
    .input(type({ username: 'string' }).assert)
    .output(arkApiUserProfileOutput.assert)
    .query(async ({ input }) => {
      const result = await getUserProfile(input.username);

      return {
        profile: result,
      };
    }),

  follow: authenticatedProcedure
    .input(type({ username: 'string' }).assert)
    .mutation(async ({ input }) => {
      return await followUser(input.username);
    }),

  unfollow: authenticatedProcedure
    .input(type({ username: 'string' }).assert)
    .mutation(async ({ input }) => {
      return await unfollowUser(input.username);
    }),
});
