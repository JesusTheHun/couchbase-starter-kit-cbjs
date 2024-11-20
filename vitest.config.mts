import * as inspector from 'node:inspector';
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

const isDebug = inspector.url() !== undefined;

export default defineConfig({
  resolve: {
    alias: {
      src: resolve("./src"),
      tests: resolve("./tests"),
    },
  },
  test: {
    setupFiles: ['./tests/setupTests.ts', './tests/setupLogger.ts'],
    globalSetup: ['./tests/setupTestsOnce.ts'],
    include: ['**/*.spec.ts'],
    sequence: {
      hooks: 'stack',
    },
    hookTimeout: isDebug ? 999_999 : 5_000,
    isolate: false,
    fileParallelism: false,
    disableConsoleIntercept: true,
    testTimeout: isDebug ? 999_999 : 1_000,
    restoreMocks: true,
    mockReset: true,
    unstubGlobals: true,
    unstubEnvs: true,
  },
});
