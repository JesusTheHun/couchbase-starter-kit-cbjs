import { TRPCError, TRPCProcedureType } from '@trpc/server';
import { TRPCErrorShape } from '@trpc/server/rpc';
import { type } from 'arktype';

import { appConfig } from 'src/config.js';

export function errorFormatter(opts: {
  error: TRPCError;
  type: TRPCProcedureType | 'unknown';
  path: string | undefined;
  input: unknown;
  shape: TRPCErrorShape;
}) {
  const { shape, input, error } = opts;

  if (appConfig.LOG_ENABLED) {
    console.log(shape);
    console.log('input data : ', JSON.stringify(input, undefined, 2));
  }

  delete (shape.data as any).stack;

  if (error.code === 'BAD_REQUEST' && error.cause instanceof type.errors) {
    return {
      ...shape,
      data: {
        ...shape.data,
        error: error.cause.summary,
      },
    };
  }

  if (error.code === 'INTERNAL_SERVER_ERROR') {
    return {
      ...shape,
      message: "Something wrong happened. We're already working on it !",
    };
  }

  return shape;
}
