import 'vitest';

import type { ExpectTRPCError } from 'tests/matchers/toThrowTRPCError.js';

declare module 'vitest' {
  interface Assertion<T = any> extends ExpectTRPCError<T> {}

  interface AsymmetricMatchersContaining extends ExpectTRPCError {}
}
