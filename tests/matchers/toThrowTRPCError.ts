/*
 * Copyright (c) 2023-Present Jonathan MASSUCHETTI <jonathan.massuchetti@dappit.fr>.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { expect } from 'vitest';

import { TRPCError } from '@trpc/server';
import { TRPC_ERROR_CODE_KEY } from '@trpc/server/rpc';

expect.extend({
  toThrowTRPCError(received, code?: TRPC_ERROR_CODE_KEY, message?: string) {
    const { isNot, promise, equals } = this;

    const withCodeSuffix = code === undefined ? '' : ` with code ${code}`;

    const failure = {
      message: () =>
        `expected "${received}" ${isNot ? 'to not be' : 'to be'} a TRPCError${withCodeSuffix}`,
      pass: false,
    };

    if (promise !== 'rejects') {
      return {
        message: () =>
          `expected promise ${isNot ? 'to not throw' : 'to throw'} a TRPCError${withCodeSuffix}, but resolved instead`,
        pass: false,
      };
    }

    if (!(received instanceof TRPCError)) {
      return failure;
    }

    if (code !== undefined && received.code !== code) {
      return failure;
    }

    if (message !== undefined && !equals(received.message, message)) {
      return failure;
    }

    return {
      message: () => `TRPCError${withCodeSuffix}`,
      pass: true,
    };
  },
});

export interface ExpectTRPCError<R = unknown> {
  toThrowTRPCError(code?: TRPC_ERROR_CODE_KEY, message?: string): R;
}
