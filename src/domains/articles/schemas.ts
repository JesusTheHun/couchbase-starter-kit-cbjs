import { type } from 'arktype';

import { arkUserId } from 'src/database/models/ids.js';

export const arkApiArticleCriteria = type({
  'tag?': 'undefined | string',
  'author?': arkUserId.or('undefined'),
  'favorited?': arkUserId.or('undefined'),
  'limit?': 'number.integer = 20',
  'offset?': 'number.integer = 0',
});

export type ApiArticleCriteria = typeof arkApiArticleCriteria.infer;
