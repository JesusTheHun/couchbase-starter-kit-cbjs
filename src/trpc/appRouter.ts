import { inferRouterOutputs } from '@trpc/server';
import { mergeRouters } from '@trpc/server/unstable-core-do-not-import';

import { articlesRouter } from 'src/domains/articles/router.js';
import { authenticationRouter } from 'src/domains/authentication/router.js';
import { commentsRouter } from 'src/domains/comments/router.js';
import { favoritesRouter } from 'src/domains/favorites/router.js';
import { profilesRouter } from 'src/domains/profiles/router.js';
import { router, t } from 'src/trpc/trpc.js';

export const appRouter = router({
  auth: authenticationRouter,
  profiles: profilesRouter,
  articles: mergeRouters(articlesRouter, favoritesRouter, commentsRouter),
});

export type AppRouterOutputs = inferRouterOutputs<typeof appRouter>;
