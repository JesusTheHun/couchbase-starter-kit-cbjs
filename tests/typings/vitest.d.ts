import 'vitest';

import type { ExpectCAS, ExpectMutationToken } from '@cbjsdev/vitest/matchers';

import type { ExpectToContainDocument } from 'tests/matchers/toContainDocument.js';
import type { ExpectTRPCError } from 'tests/matchers/toThrowTRPCError.js';

declare module 'vitest' {
  interface Assertion<T = any>
    extends ExpectTRPCError<T>,
      ExpectToContainDocument,
      ExpectCAS<T>,
      ExpectMutationToken<T> {}
  interface AsymmetricMatchersContaining
    extends ExpectTRPCError,
      ExpectToContainDocument,
      ExpectCAS,
      ExpectMutationToken {}
  {
  }
}
