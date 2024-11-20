import { nodeResolve } from '@rollup/plugin-node-resolve';
import ts from 'rollup-plugin-ts';
import json from '@rollup/plugin-json';

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.mjs',
      format: 'esm',
    },
    plugins: [
      ts({ tsconfig: 'tsconfig.json' }),
      nodeResolve(),
      json(),
    ],
    external: ['@cbjsdev/cbjs'],
  },
];
