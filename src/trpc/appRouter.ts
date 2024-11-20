import { inferRouterOutputs } from '@trpc/server';

import { authenticationRouter } from 'src/domains/authentication/router.js';
import { profilesRouter } from 'src/domains/profiles/router.js';
import { router, t } from 'src/trpc/trpc.js';

export const appRouter = router({
  auth: authenticationRouter,
  profiles: profilesRouter,
});

export type AppRouterOutputs = inferRouterOutputs<typeof appRouter>;
