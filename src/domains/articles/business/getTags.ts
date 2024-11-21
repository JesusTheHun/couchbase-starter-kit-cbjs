import { getUnauthenticatedRequestContext } from 'src/trpc/requestALS.js';

export async function getTags() {
  const { cb } = getUnauthenticatedRequestContext();

  const result = await cb.query(`
    SELECT DISTINCT RAW tags FROM articles UNNEST tagList AS tags
  `);

  return result.rows;
}
